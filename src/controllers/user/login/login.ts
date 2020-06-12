import express, { Request, Response} from 'express'
import HttpCode from 'http-status-codes'
import { signIn, remindPassword } from 'services/logging'
import { TokenMiddleware } from 'middlewares/token-middleware'
import resetRoute from './reset/reset'
import MyError from 'misc/my-error'
import { decrypt } from 'init/generate-keys'

const router = express.Router()

router.route('/login')
.post(async (req: Request, res: Response) => { // sign in
    req.body.password = decrypt(req.body.password)
    
    const data = await signIn(req.body)
    if(!(data instanceof Error)) {
    	const maxAge = data.expiresIn * 1000
        res.cookie('id', data.user_id, {maxAge, httpOnly: false})
        res.cookie('secure-id', data.user_id, {maxAge, httpOnly: true})
        res.cookie('secure-token', data.token, {maxAge, httpOnly: true})
        res.cookie('token-expire-date', new Date(Date.now() + maxAge).toString(), {maxAge, httpOnly: false})
        res.sendStatus(HttpCode.OK)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(data instanceof MyError ? data.message : 'cannot sign in')
    }
})
.get(async (req: Request, res: Response) => { // forgot password
    let err = await remindPassword(req.body)
    if(!err) {
        res.sendStatus(HttpCode.NO_CONTENT)
    } else {
        res.status(HttpCode.NOT_FOUND).send(err instanceof MyError ? err.message : 'cannot do that action')
    }
})
.delete(TokenMiddleware(), async (req: Request, res: Response) => { // logout
    res
    .cookie('id', '', {maxAge: 0})
    .cookie('secure-id', '', {maxAge: 0})
    .cookie('secure-token', '', {maxAge: 0})
    .cookie('token-expire-date', '', {expires: new Date()})
    .sendStatus(HttpCode.NO_CONTENT)
})

router.use('/login', resetRoute)

export default router
