import express, { Request, Response } from 'express'
import clientInfo from 'config/client.json'
import HttpCode from 'http-status-codes'
import { verify } from 'services/registration'

const router = express.Router()

// sign up
router.route('/verify')
.get(async (req: Request, res: Response) => {
    if(await verify(req.body)) {
        res.status(HttpCode.PERMANENT_REDIRECT).redirect(`http://${clientInfo.ip}:${clientInfo.port}/${clientInfo.endpoints.login}`)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})

export default router