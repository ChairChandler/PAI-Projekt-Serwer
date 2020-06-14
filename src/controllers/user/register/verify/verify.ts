import express, { Request, Response } from 'express'
import clientInfo from 'config/client.json'
import HttpCode from 'http-status-codes'
import { verify } from 'services/registration'

const router = express.Router()

router.route('/verify')
.get(async (req: Request, res: Response) => {
    let err = await verify(req.body)
    if(!err) {
        res.status(HttpCode.PERMANENT_REDIRECT).redirect(`http://${clientInfo.ip}:${clientInfo.port}/main#login`)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err instanceof Error ? err.message : 'cannot verify email')
    }
})

export default router
