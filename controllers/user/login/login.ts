import express, { Request, Response} from 'express'
import HttpCode from 'http-status-codes'
import { signIn, remindPassword } from 'services/logging'

const router = express.Router()

router.route('/login')
.put(async (req: Request, res: Response) => { // sign in
    if(await signIn(req)) {
        res.status(HttpCode.NO_CONTENT).send()
    } else {
        res.status(HttpCode.NOT_FOUND).send()
    }
})
.get(async (req: Request, res: Response) => { // forgot password
    if(await remindPassword(req)) {
        res.status(HttpCode.NO_CONTENT).send()
    } else {
        res.status(HttpCode.NOT_FOUND).send()
    }
})

export default router