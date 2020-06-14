import Contestants from 'models/contestants'
import Tournament from 'models/tournament'
import User from 'models/user'
import db from 'static/database'
import { Transaction } from 'sequelize'
import JobStorage from 'misc/jobs-storage'
import Schedule from 'node-schedule'
import * as API from 'api/tournament'

export async function shuffleAllTournaments() {
    const t = await db.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE })
    try {
        const unfinished = await Tournament.findAll({ where: { finished: false }, transaction: t })
        for (const { id, datetime } of unfinished ?? []) {
            const job = Schedule.scheduleJob(datetime, () => shuffleTournament(id))
            JobStorage.setJob(id, job)
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
        const contestants = await Contestants.findAll({ where: { tournament_id }, order: [['ranking_pos', 'DESC']] })
        const amount = contestants.length
        let requiredNodes = 2 * amount - 2 // counting nodes from 0
        await Promise.all(contestants.map(
            c => c.update({ node_id: requiredNodes-- })
        ))

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
            async ({ node_id, user_id: id }) => {
                const { name, lastname } = await User.findOne({ where: { id } })
                return ({ id, node_id, name: `${name} ${lastname}` })
            }))

        return {
            nodes: contestants.length,
            contestants: data
        }
    } catch (err) {
        console.error(err)
        return err
    }
}

export async function setScore(body: API.TOURNAMENT.LADDER.PUT.INPUT): Promise<void | Error> {

    let t = await db.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE })
    try {
        const tournament = await Tournament.findOne({ where: { id: body.tournament_id }, transaction: t })
        if (tournament.finished) {
            throw Error('tournament is finished, cannot change position')
        }

        const contestant = await Contestants.findOne({
            where: { tournament_id: body.tournament_id, user_id: body.contestant_id }, transaction: t
        })

        const winnerNode = Math.floor((contestant.node_id - 1) / 2)
        const enemyLoserNode = 2 * winnerNode + ((Math.floor(contestant.node_id / 2) != winnerNode) ? 1 : 2)

        const enemy = await Contestants.findOne({
            where: {
                tournament_id: body.tournament_id,
                $or: [
                    { node_id: { $eq: winnerNode } },
                    { node_id: { $eq: enemyLoserNode } }
                ]
            }, transaction: t
        })


        let error: Error
        if (enemy) {
            if (body.winner && enemy.defeated === false) { // WIN-WIN
                await enemy.update({ defeated: null, node_id: enemyLoserNode }, { transaction: t })
                error = Error('winner-winner conflict')

            } else if (body.winner && enemy.defeated) { // WIN-LOSE
                await contestant.update({ defeated: null, node_id: winnerNode }, { transaction: t })

            } else if (!body.winner && enemy.defeated) { // LOSE-LOSE
                await enemy.update({ defeated: null }, { transaction: t })
                error = Error('loser-loser conflict')

            } else if (!body.winner && !enemy.defeated) { // LOSE-WIN
                await Promise.all([
                    contestant.update({ defeated: true }, { transaction: t }),
                    enemy.update({ defeated: null, node_id: winnerNode }, { transaction: t })
                ])
            }
        } else {
            error = Error('enemy has not played with contestant')
        }



        if (error) {
            t.commit()
            t = null
            throw error
        } else if (!winnerNode) {
            await tournament.update({ finished: true }, { transaction: t })
            t.commit()
        }
    } catch (err) {
        t?.rollback()
        console.error(err)
        return err
    }
}