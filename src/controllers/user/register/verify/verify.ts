import express, { Request, Response } from 'express'
import clientInfo from 'config/client.json'
import HttpCode from 'http-status-codes'
import { verify } from 'services/registration'
import MyError from 'misc/my-error'

const router = express.Router()

router.route('/verify')
.get(async (req: Request, res: Response) => {
    let err = await verify(req.body)
    if(!err) {
        res.status(HttpCode.PERMANENT_REDIRECT).redirect(`http://${clientInfo.ip}:${clientInfo.port}#login`)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err instanceof MyError ? err.message : 'cannot verify email')
    }
})

export default router