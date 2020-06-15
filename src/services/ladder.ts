import Contestants from 'models/contestants'
import Tournament from 'models/tournament'
import User from 'models/user'
import db from 'static/database'
import { Transaction } from 'sequelize'
import JobStorage from 'static/jobs-storage'
import Schedule from 'node-schedule'
import * as API from 'api/tournament'
import LogicError from 'misc/logic-error'
import { Op } from 'sequelize'

export async function shuffleAllTournaments() {
    const t = await db.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE })
    try {
        const unstarted = await Tournament.findAll({
            where: { started: false, finished: false },
            transaction: t
        })

        for (const { id, datetime } of unstarted ?? []) {
            if (datetime.getOnlyDate().getTime() < new Date().getOnlyDate().getTime()) {
                shuffleTournament(id)
            } else {
                const job = Schedule.scheduleJob(datetime, () => shuffleTournament(id))
                JobStorage.setJob(id, job)
            }
        }

        t.commit()
    } catch (err) {
        t.rollback()
        console.error(err)
    }
}

export async function shuffleTournament(tournament_id: number) {
    const t = await db.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE })
    try {
        const tournament = await Tournament.findOne({
            where: { id: tournament_id },
            transaction: t
        })

        if (tournament.started) {
            throw Error('tournament started, cannot shuffle contestants again')
        }

        const contestants = await Contestants.findAll({
            where: { tournament_id },
            order: [['ranking_pos', 'DESC']]
        })

        const amount = contestants.length
        let assignedNode = 2 * amount - 2 // counting nodes from 0
        await Promise.all(contestants.map(
            c => c.update({ node_id: assignedNode-- })
        ))

        tournament.update({ started: true })

        t.commit()
    } catch (err) {
        t.rollback()
        console.error(err)
    }
}

export async function getLadderInfo(body: API.TOURNAMENT.LADDER.GET.INPUT):
    Promise<API.TOURNAMENT.LADDER.GET.OUTPUT | Error> {

    try {
        const contestants = await Contestants.findAll({
            where: { tournament_id: body.tournament_id },
            order: [['ranking_pos', 'DESC']]
        })

        const data = await Promise.all(contestants.map(
            async ({ node_id, user_id: id, defeated }) => {
                const { name, lastname } = await User.findOne({ where: { id } })
                return ({ id, node_id, name: `${name} ${lastname}`, defeated })
            }))

        return {
            lastNode: 2 * contestants.length - 2,
            contestants: data
        }
    } catch (err) {
        console.error(err)
        return err
    }
}

export async function setScore(body: API.TOURNAMENT.LADDER.PUT.INPUT): Promise<void | Error | LogicError> {

    let t = await db.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE })
    try {
        const tournament = await Tournament.findOne({ where: { id: body.tournament_id }, transaction: t })
        if (tournament.finished) {
            throw new LogicError('tournament is finished, cannot change position')
        }

        const contestant = await Contestants.findOne({
            where: { tournament_id: body.tournament_id, user_id: body.user_id }, transaction: t
        })

        /* Example:
            Contestant node: 
            1 or 2 -> winner node = 0, enemy loser node = 2 if cont node 1, 1 if cont node 2
            3 or 4 -> winner node = 1 enemy loser node = 4 if cont node 3, 3 if cont node 4 
            and so on ...

        */
        const winnerNode = Math.floor((contestant.node_id - 1) / 2)
        const enemyLoserNode = 2 * winnerNode + ((Math.floor(contestant.node_id / 2) != winnerNode) ? 1 : 2)

        const enemy = await Contestants.findOne({
            where: {
                tournament_id: body.tournament_id,
                node_id: {
                    [Op.or]: [winnerNode, enemyLoserNode]
                }
            }, transaction: t
        })

        
        const enemyUnknown = enemy.defeated === null
        const enemyDefeated = enemy.defeated === true
        const enemyDefeatedOrUnknown = enemyDefeated || enemyUnknown
        const enemyWon = !enemyDefeatedOrUnknown
        const enemyWonOrUnknown = enemy.defeated === false || enemy.defeated === null


        let error: Error, readyForNextRound: boolean = false
        if (enemy) {

            const prevEnemyNode = [2 * contestant.node_id + 1, 2 * contestant.node_id + 2]
            const prevEnemy = await Contestants.findOne({
                where: {
                    tournament_id: body.tournament_id,
                    node_id: {
                        [Op.or]: prevEnemyNode
                    }
                }, transaction: t
            })

            if (prevEnemy && !prevEnemy?.defeated) {
                throw new LogicError('previous enemy has not sent result')
            }

            if (body.winner && enemyWon) { // WIN-WIN
                await enemy.update({ defeated: null, node_id: enemyLoserNode }, { transaction: t })
                error = new LogicError('winner-winner conflict')

            } else if (body.winner && enemyDefeatedOrUnknown) { // WIN-LOSE?
                await contestant.update({ defeated: false, node_id: winnerNode }, { transaction: t })
                readyForNextRound = enemyDefeated

            } else if (!body.winner && enemyDefeated) { // LOSE-LOSE
                await enemy.update({ defeated: null }, { transaction: t })
                error = new LogicError('loser-loser conflict')

            } else if (!body.winner && enemyWonOrUnknown) { // LOSE-WIN?
                await contestant.update({ defeated: true }, { transaction: t })
            }
        } else {
            error = new LogicError('enemy has not played with contestant')
        }


        if (error) {
            t.commit()
            t = null
            throw error
        }

        if (winnerNode) {
            if (readyForNextRound) {
                const newEnemyNode = winnerNode % 2 ? winnerNode + 1 : winnerNode - 1
                const newEnemy = await Contestants.findOne({
                    where: { tournament_id: body.tournament_id, node_id: newEnemyNode }, transaction: t
                })
                if (newEnemy) {
                    const node = [2 * newEnemyNode + 1, 2 * newEnemyNode + 2]
                    const loser = await Contestants.findOne({
                        where: {
                            tournament_id: body.tournament_id,
                            node_id: {
                                [Op.or]: node
                            }
                        }, transaction: t
                    })

                    if (loser.defeated) {
                        await Promise.all([
                            contestant.update({ defeated: null }, { transaction: t }),
                            newEnemy.update({ defeated: null }, { transaction: t })
                        ])
                    }
                }
            }
        } else if(enemyDefeated) {
            await tournament.update({ finished: true }, { transaction: t })
        }

        t.commit()
    } catch (err) {
        t?.rollback()
        console.error(err)
        return err
    }
}
