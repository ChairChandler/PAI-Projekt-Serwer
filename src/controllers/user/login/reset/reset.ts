import express, { Request, Response} from 'express'
import HttpCode from 'http-status-codes'
import { changePassword } from 'services/logging'

const router = express.Router()

// change password
router.route('/reset')
.post(async (req: Request, res: Response) => { //ought to be put however form cannot allow to use this method
    let err = await changePassword(req.body)
    if(!err) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err instanceof Error ? err.message : 'cannot change password')
    }
})

export default router