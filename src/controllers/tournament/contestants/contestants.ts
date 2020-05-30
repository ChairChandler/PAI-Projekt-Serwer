import express, { Request, Response}from 'express'
import HttpCode from 'http-status-codes'
import { TokenMiddleware } from 'middlewares/token-middleware'
import { createContestant, getContestants } from 'services/contestants'

const router = express.Router()

router.route('/contestants')
.post(TokenMiddleware(), async (req: Request, res: Response) => { // add contestant to the tournament
    if(await createContestant(req.body, Number.parseInt(req.cookies["id"]))) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})
.get(TokenMiddleware(), async (req: Request, res: Response) => { // get tournament contestants list
    let data
    if((data = await getContestants(req.body, Number.parseInt(req.cookies["id"])))) {
        res.status(HttpCode.OK).send(data)
    } else {
        res.sendStatus(HttpCode.UNAUTHORIZED)
    }
})

export default router