import Contestants from 'models/contestants'
import Tournament from 'models/tournament'
import db from 'static/database'
import { Transaction } from 'sequelize'
import JobStorage from 'misc/jobs-storage'
import Schedule from 'node-schedule'

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

export async function shuffleTournament(tournament_id: number): Promise<void> {
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