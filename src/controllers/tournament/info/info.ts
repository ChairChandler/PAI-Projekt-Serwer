import express, { Request, Response } from 'express'
import HttpCode from 'http-status-codes'
import { getTournamentInfo, createTournament, modifyTournament } from 'services/tournament'
import { TokenMiddleware } from 'middlewares/token-middleware'

const router = express.Router()

router.route('/info')
.get(async (req: Request, res: Response) => { // get selected tournament details
    let data
    if((data = await getTournamentInfo(req.body))) {
        res.status(HttpCode.OK).send(data)
    } else {
        res.sendStatus(HttpCode.NOT_FOUND)
    }
})
.put(TokenMiddleware(), async (req: Request, res: Response) => { // modify selected tournament details
    if(await modifyTournament(req.body, Number.parseInt(req.cookies["id"]))) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})
.post(TokenMiddleware(), async(req: Request, res: Response) => { // create new tournament
    if(await createTournament(req.body, Number.parseInt(req.cookies["id"]))) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})

export default router