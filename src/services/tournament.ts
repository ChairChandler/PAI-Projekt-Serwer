import Tournament from 'models/tournament'
import User from 'models/user'
import * as API from 'api/tournament'
import Logo from 'models/logo'
import db from 'static/database'

export async function getTournamentList(body: API.TOURNAMENT.LIST.GENERAL.GET.INPUT): 
Promise<API.TOURNAMENT.LIST.GENERAL.GET.OUTPUT> {
    try {
        let tournaments: Tournament[]
        if(body.amount) {
            tournaments = await Tournament.findAll({limit: body.amount})
        } else {
            tournaments = await Tournament.findAll()
        }
        return tournaments.map(v => Object({"id": v.id, "name": v.tournament_name}))
    } catch(err) {
        console.error(err)
        return null
    }
}

export async function getTournamentInfo(body: API.TOURNAMENT.INFO.GET.INPUT): 
Promise<API.TOURNAMENT.INFO.GET.OUTPUT> {
    try {
        const info = await Tournament.findOne({where: {id: body.id}})
        const owner = await User.findOne({where: {id: info.owner_id}})
        const logos = await Logo.findAll({where: {tournament_id: body.id}})
        const imgData = []
        for(let img of logos) {
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
        return null
    }
}

export async function createTournament(body: API.TOURNAMENT.INFO.POST.INPUT, id: number): Promise<Boolean> {
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
        })

        for(const logo of body.logos) {
            await Logo.create({
                tournament_id: tournament.id,
                logo: logo
            })
        }

        await t.commit()
        return true
    } catch (err) {
        await t.rollback()
        console.error(err)
        return false
    }
}

export async function modifyTournament(body: API.TOURNAMENT.INFO.PUT.INPUT, id: number): Promise<Boolean> {
    const t = await db.transaction()
    try {
        const update_body = {}
        if('tournament_name' in body) {
            update_body['tournament_name'] = body.tournament_name
        } if('description' in body) {
            update_body['description'] = body.description
        } if('datetime' in body) {
            update_body['datetime'] = body.datetime
        } if('localization_lat' in body) {
            update_body['localization_lat'] = body.localization_lat
        } if('localization_lng' in body) {
            update_body['localization_lng'] = body.localization_lng
        } if('participants_limit' in body) {
            update_body['participants_limit'] = body.participants_limit
        } if('joining_deadline' in body) {
            update_body['joining_deadline'] = body.joining_deadline
        }

        const tournament = await Tournament.findOne({where: {id: body.tournament_id}})
        if(tournament.owner_id != id) {
            throw Error('unauthorized access to modify protected data')
        }

        await tournament.update(update_body)
        if('logos' in body) {
            for(const l of body.logos) {
                if(l.id) {
                    await Logo.update({logo: l.data}, {where: {id: l.id}})
                } else {
                    await Logo.create({tournament_id: body.tournament_id, logo: l.data})
                }
            }
        }

        await t.commit()
        return true
    } catch (err) {
        await t.rollback()
        console.error(err)
        return false
    }
}