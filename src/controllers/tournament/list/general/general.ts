import express, { Request, Response} from 'express'
import HttpCode from 'http-status-codes'
import { getTournamentList } from 'services/tournament'
import MyError from 'misc/my-error'

const router = express.Router()

// get tournaments list
router.route('/general')
.get(async (req: Request, res: Response) => {
    let data = await getTournamentList(req.body)
    if(!(data instanceof Error)) {
        res.status(HttpCode.OK).send(data)
    } else {
        res.status(HttpCode.BAD_REQUEST).send(data instanceof MyError ? data.message : 'cannot retrieve tournaments list')
    }
})

export default router