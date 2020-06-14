import Contestants from 'models/contestants'
import Tournament from 'models/tournament'
import User from 'models/user'
import * as API from 'api/contestants'
import db from 'static/database'
import LogicError from 'misc/logic-error.ts'

export async function createContestant(body: API.TOURNAMENT.CONTESTANTS.POST.INPUT, id: number): Promise<void | Error | LogicError> {
    const t = await db.transaction()

    try {
        const now = new Date().getOnlyDate().getTime()
        const tinfo = await Tournament.findOne({ where: { id: body.tournament_id } })

        if (tinfo.finished) {
            throw new LogicError('cannot join to finished tournament')
        } else if (tinfo.current_contestants_amount == tinfo.participants_limit) {
            throw new LogicError('reached maximum participants limit')
        } else if (now >= tinfo.datetime.getOnlyDate().getTime() || now >= tinfo.joining_deadline.getOnlyDate().getTime()) {
            throw new LogicError('exceeded joining deadline')
        }

        await Promise.all([
            Contestants.create({
                user_id: id,
                tournament_id: body.tournament_id,
                license_id: body.license_id,
                ranking_pos: body.ranking_pos
            }, { transaction: t }),

            tinfo.update({
                current_contestants_amount: tinfo.current_contestants_amount + 1
            }, { transaction: t })
        ])

        t.commit()
    } catch (err) {
        t.rollback()
        console.error(err)
        return err
    }
}

export async function getContestants(body: API.TOURNAMENT.CONTESTANTS.GET.INPUT, id: number):
    Promise<API.TOURNAMENT.CONTESTANTS.GET.OUTPUT | Error> {
    try {
        let data
        const tournament = await Tournament.findOne({ where: { id: body.tournament_id } })
        if (tournament.owner_id === id) {
            const contestants = await Contestants.findAll({ where: { tournament_id: body.tournament_id } })
            data = await Promise.all(
                contestants.map(async ({ user_id }) => {
                    const { name, lastname } = await User.findOne({ where: { id: user_id } })
                    return { user_id, name, lastname }
                }))
        } else { // not owner, asking if taking part in tournament
            const contestant = await Contestants.findOne({ where: { user_id: id, tournament_id: body.tournament_id } })
            data = { taking_part: contestant ? true : false }
        }

        return data
    } catch (err) {
        console.error(err)
        return err
    }
}