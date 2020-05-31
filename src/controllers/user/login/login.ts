import express, { Request, Response} from 'express'
import HttpCode from 'http-status-codes'
import { signIn, remindPassword } from 'services/logging'
import resetRoute from './reset/reset'

const router = express.Router()

router.route('/login')
.put(async (req: Request, res: Response) => { // sign in
    const data = await signIn(req.body)
    if(!(data instanceof Error)) {
        res.cookie('id', data.user_id, {httpOnly: true})
        res.cookie('token', data.token, {maxAge: data.expiresIn * 1000, httpOnly: true})
        res.sendStatus(HttpCode.OK)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(data.message)
    }
})
.get(async (req: Request, res: Response) => { // forgot password
    let err = await remindPassword(req.body)
    if(!err) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.status(HttpCode.NOT_FOUND).send(err.message)
    }
})

router.use('/login', resetRoute)

export default router