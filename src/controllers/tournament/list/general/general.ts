import express, { Request, Response} from 'express'
import HttpCode from 'http-status-codes'
import { getTournamentList } from 'services/tournament'

const router = express.Router()

// get tournaments list
router.route('/general')
.get(async (req: Request, res: Response) => {
    let data
    if((data = await getTournamentList(req.body))) {
        res.status(HttpCode.OK).send(data)
    } else {
        res.status(HttpCode.BAD_REQUEST).send()
    }
})

export default router