import express, { Request, Response } from 'express'
import HttpCode from 'http-status-codes'
import { getTournamentInfo, createTournament, modifyTournament } from 'services/tournament'
import { TokenMiddleware } from 'middlewares/token-middleware'

const router = express.Router()

router.route('/info')
.get(async (req: Request, res: Response) => { // get selected tournament details
    let data = await getTournamentInfo(req.body)
    if(!(data instanceof Error)) {
        res.status(HttpCode.OK).send(data)
    } else {
        res.status(HttpCode.NOT_FOUND).send(data.message)
    }
})
.put(TokenMiddleware(), async (req: Request, res: Response) => { // modify selected tournament details
    let err = await modifyTournament(req.body, Number.parseInt(req.cookies["id"]))
    if(!err) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})
.post(TokenMiddleware(), async(req: Request, res: Response) => { // create new tournament
    let err = await createTournament(req.body, Number.parseInt(req.cookies["id"]))
    if(!err) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})

export default router