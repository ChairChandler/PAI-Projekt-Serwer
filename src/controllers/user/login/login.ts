import express, { Request, Response} from 'express'
import HttpCode from 'http-status-codes'
import { signIn, remindPassword } from 'services/logging'
import resetRoute from './reset/reset'

const router = express.Router()

router.route('/login')
.put(async (req: Request, res: Response) => { // sign in
    const token_info = await signIn(req.body)
    if(token_info) {
        const expiration_date = new Date(new Date().getTime() + token_info.expiresIn)
        res.cookie('token', token_info.token, {secure: true, expires: expiration_date, httpOnly: true})
        res.sendStatus(HttpCode.OK)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})
.get(async (req: Request, res: Response) => { // forgot password
    if(await remindPassword(req.body)) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpCode.NOT_FOUND)
    }
})

router.use('/login', resetRoute)

export default router