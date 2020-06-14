import express, { Request, Response } from 'express'
import { TokenMiddleware } from 'middlewares/token-middleware'
import { getLadderInfo, setScore } from 'services/ladder'
import HttpCode from 'http-status-codes'
import LogicError from 'misc/logic-error'

const router = express.Router()

router.route('/ladder')
    .get(TokenMiddleware(), async (req: Request, res: Response) => { // get tournament ladder
        let data = await getLadderInfo(req.body)
        if (!(data instanceof Error)) {
            res.sendStatus(HttpCode.OK)
        } else {
            res.status(HttpCode.INTERNAL_SERVER_ERROR).send('cannot send ladder')
        }
    })
    .put(TokenMiddleware(), async (req: Request, res: Response) => { // modify ladder node winner
        let data = await setScore(req.body)
        if (!(data instanceof Error)) {
            res.sendStatus(HttpCode.OK)
        } else {
            res.status(HttpCode.INTERNAL_SERVER_ERROR).send(data instanceof LogicError ? data.message : 'cannot update score')
        }
    })

export default router