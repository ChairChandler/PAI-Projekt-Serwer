import Tournament from 'models/tournament'
import User from 'models/user'
import * as API from 'api/tournament'
import Logo from 'models/logo'
import db from 'static/database'

export async function getTournamentList(body: API.TOURNAMENT.LIST.GENERAL.GET.INPUT): 
Promise<API.TOURNAMENT.LIST.GENERAL.GET.OUTPUT|Error> {
    try {
        let tournaments = await Tournament.findAll()
        if(body.amount) { 
            /* 
            unfortunately cannot use limit prop due to casting non-literal to string (bug)
            which cause database error
            */
            tournaments = tournaments.slice(0, body.amount)
        }

        return tournaments.map(v => ({"id": v.id, "name": v.tournament_name}))
    } catch(err) {
        console.error(err)
        return err
    }
}

export async function getTournamentInfo(body: API.TOURNAMENT.INFO.GET.INPUT): 
Promise<API.TOURNAMENT.INFO.GET.OUTPUT|Error> {
    try {
        const info = await Tournament.findOne({where: {id: body.tournament_id}})
        const owner = await User.findOne({where: {id: info.owner_id}})
        const logos = await Logo.findAll({where: {tournament_id: body.tournament_id}})
        const imgData = []
        for(const img of logos) {
            imgData.push({
                id: img.id, 
                data: new Uint8ClampedArray(await img.logo.arrayBuffer())
            })
        }

        return {
            tournament_name: info.tournament_name,
            description: info.description,
            organizer: `${owner.name} ${owner.lastname}`,
            datetime: info.datetime,
            localization_lat: info.localization_lat, //latitude
            localization_lng: info.localization_lng, //longitude
            participants_limit: info.participants_limit,
            joining_deadline: info.joining_deadline,
            current_contestants_amount: info.current_contestants_amount,
            logos: imgData
        }
    } catch(err) {
        console.error(err)
        return err
    }
}

export async function createTournament(body: API.TOURNAMENT.INFO.POST.INPUT, id: number): Promise<void|Error> {
    const t = await db.transaction()
    try {
        const tournament = await Tournament.create({
            owner_id: id,
            tournament_name: body.tournament_name,
            description: body.description,
            datetime: body.datetime,
            localization_lat: body.localization_lat,
            localization_lng: body.localization_lng,
            participants_limit: body.participants_limit,
            joining_deadline: body.joining_deadline
        }, {transaction: t})

        for(const logo of body.logos) {
            await Logo.create({tournament_id: tournament.id, logo})
        }

        await t.commit()
    } catch (err) {
        await t.rollback()
        console.error(err)
        return err
    }
}

export async function modifyTournament(body: API.TOURNAMENT.INFO.PUT.INPUT, id: number): Promise<void|Error> {
    const t = await db.transaction()
    try {
        const tournament = await Tournament.findOne({where: {id: body.tournament_id}})
        if(tournament.owner_id != id) {
            throw Error('unauthorized access to modify protected data')
        }

        const {
            tournament_name = tournament.tournament_name,
            description = tournament.description,
            datetime = tournament.datetime,
            localization_lat = tournament.localization_lat,
            localization_lng = tournament.localization_lng,
            participants_limit = tournament.participants_limit,
            joining_deadline = tournament.joining_deadline,
        } = body


        await tournament.update({
            tournament_name, 
            description, 
            datetime, 
            localization_lat, 
            localization_lng, 
            participants_limit, 
            joining_deadline
        }, {transaction: t})

        if(body.logos) {
            for(const l of body.logos) {
                if(l.id) {
                    await Logo.update({logo: l.data}, {where: {id: l.id}, transaction: t})
                } else {
                    await Logo.create({tournament_id: body.tournament_id, logo: l.data}, {transaction: t})
                }
            }
        }

        await t.commit()
    } catch (err) {
        await t.rollback()
        console.error(err)
        return err
    }
}