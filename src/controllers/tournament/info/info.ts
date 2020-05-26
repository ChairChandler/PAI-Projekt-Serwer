import express, { Request, Response } from 'express'
import HttpCode from 'http-status-codes'
import { getTournamentInfo } from 'services/tournament'
import { TokenMiddleware } from 'utils/token-middleware'

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

})
.post(TokenMiddleware(), async(req: Request, res: Response) => { // create new tournament

})

export default router