import express, { Request, Response}from 'express'
import HttpCode from 'http-status-codes'
import { TokenMiddleware } from 'middlewares/token-middleware'
import { createContestant, getContestants } from 'services/contestants'
import LogicError from 'misc/logic-error'

const router = express.Router()

router.route('/contestants')
.post(TokenMiddleware(), async (req: Request, res: Response) => { // add contestant to the tournament
    let err = await createContestant(req.body, Number.parseInt(req.cookies["secure-id"]))
    if(!err) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err instanceof LogicError ? err.message : 'cannot join to the tournament')
    }
})
.get(async (req: Request, res: Response) => { // get tournament contestants list
    let data = await getContestants(req.body, Number.parseInt(req.cookies["secure-id"]))
    if(!(data instanceof Error)) {
        res.status(HttpCode.OK).send(data)
    } else {
        res.status(HttpCode.UNAUTHORIZED).send('cannot retrieve tournament contestants list')
    }
})

export default router