import express, { Request, Response} from 'express'
import HttpCode from 'http-status-codes'
import { changePassword } from 'services/logging'

const router = express.Router()

// change password
router.route('/reset')
.post(async (req: Request, res: Response) => { //ought to be put however form cannot allow to use this method
    if(await changePassword(req)) {
        res.status(HttpCode.NO_CONTENT).send()
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send()
    }
})

export default router