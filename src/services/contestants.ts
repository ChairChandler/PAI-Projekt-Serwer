import Contestants from 'models/contestants'
import Tournament from 'models/tournament'
import User from 'models/user'
import * as API from 'api/contestants'

export async function createContestant(body: API.TOURNAMENT.CONTESTANTS.POST.INPUT, id: number): Promise<void|Error> {
    try {
        const now = new Date().getOnlyDate().getTime()
        const tinfo = await Tournament.findOne({where: {id: body.tournament_id}})
        if(tinfo.current_contestants_amount == tinfo.participants_limit) {
            throw Error('reached maximum participants limit')
        } else if(now >= tinfo.datetime.getOnlyDate().getTime() || now >= tinfo.joining_deadline.getOnlyDate().getTime()) {
            throw Error('exceeded joining deadline')
        }

        await Contestants.create({
            user_id: id,
            tournament_id: body.tournament_id,
            license_id: body.license_id,
            ranking_pos: body.ranking_pos
        })
    } catch(err) {
        console.error(err)
        return err
    }
}

export async function getContestants(body: API.TOURNAMENT.CONTESTANTS.GET.INPUT, id: number): 
Promise<API.TOURNAMENT.CONTESTANTS.GET.OUTPUT|Error> {
    try {
        const tournament = await Tournament.findOne({where: {owner_id: id, id: body.tournament_id}})
        if(!tournament) {
            throw Error('unauthorized access to tournament')
        }

        const contestants = await Contestants.findAll({where: {tournament_id: body.tournament_id}})
        let data = []
        for(const c of contestants) {
            const {name, lastname} = await User.findOne({where: {id: c.user_id}})
            data.push({user_id: c.user_id, name, lastname})
        }
        
        return data
    } catch(err) {
        console.error(err)
        return err
    }
}