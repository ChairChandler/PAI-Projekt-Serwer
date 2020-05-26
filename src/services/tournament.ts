import Tournament from 'models/tournament'
import User from 'models/user'
import * as API from 'api/tournament'
import Logo from 'models/logo'

export async function getTournamentList(body: API.TournamentGeneral.Input): Promise<API.TournamentGeneral.Output> {
    try {
        let tournaments: Tournament[]
        if(body.amount) {
            tournaments = await Tournament.findAll({limit: body.amount})
        } else {
            tournaments = await Tournament.findAll()
        }
        return {"tournaments": tournaments.map(v => Object({"id": v.id, "name": v.tournament_name}))}
    } catch(err) {
        console.error(err)
        return null
    }
}

export async function getTournamentInfo(body: API.TournamentInfo.Input): Promise<API.TournamentInfo.Output> {
    try {
        const info = await Tournament.findOne({where: {id: body.id}})
        const owner = await User.findOne({where: {id: info.owner_id}})
        const logos = await Logo.findAll({
            include: [Tournament], 
            where: {'$Tournament.id$': info.id}
        })
        const imgData = []
        for(let img of logos) {
            imgData.push(new Uint8ClampedArray(await img.logo.arrayBuffer()))
        }
        return {
            name: info.tournament_name,
            description: info.description,
            organizer: `${owner.name} ${owner.lastname}`,
            time: info.datetime,
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