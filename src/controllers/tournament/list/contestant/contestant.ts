import express, { Request, Response}from 'express'
import HttpCode from 'http-status-codes'
import { TokenMiddleware } from 'middlewares/token-middleware'
import { getTournamentsInfoForContestant } from 'services/tournament'

const router = express.Router()

router.route('/contestant')
.get(TokenMiddleware(), async (req: Request, res: Response) => { // get contestant future tournaments list
    let data = await getTournamentsInfoForContestant(Number.parseInt(req.cookies["id"]))
    if(!(data instanceof Error)) {
        res.status(HttpCode.OK).send(data)
    } else {
        res.status(HttpCode.NOT_FOUND).send(data.message)
    }
})

export default router