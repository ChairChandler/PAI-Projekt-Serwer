import express, { Request, Response } from 'express'
import HttpCode from 'http-status-codes'
import { getTournamentInfo, createTournament, modifyTournament } from 'services/tournament'
import { TokenMiddleware } from 'middlewares/token-middleware'
import LogicError from 'misc/logic-error'

const router = express.Router()

router.route('/info')
.get(async (req: Request, res: Response) => { // get selected tournament details
    let data = await getTournamentInfo(req.body)
    if(!(data instanceof Error)) {
        res.status(HttpCode.OK).send(data)
    } else {
        res.status(HttpCode.NOT_FOUND).send(data instanceof Error ? data.message : 'cannot retrieve tournaments info')
    }
})
.put(TokenMiddleware(), async (req: Request, res: Response) => { // modify selected tournament details
    let err = await modifyTournament(req.body, Number.parseInt(req.cookies["secure-id"]))
    if(!err) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err instanceof LogicError ? err.message : 'cannot modify tournament info')
    }
})
.post(TokenMiddleware(), async(req: Request, res: Response) => { // create new tournament
    let err = await createTournament(req.body, Number.parseInt(req.cookies["secure-id"]))
    if(!err) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err instanceof Error ? err.message : 'cannot create new tournament')
    }
})

export default router