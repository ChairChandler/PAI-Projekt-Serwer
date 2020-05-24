import express, { Request, Response } from 'express'
import clientInfo from 'config/client.json'
import HttpCode from 'http-status-codes'
import { verify } from 'services/registration'

const router = express.Router()

// sign up
router.route('/verify')
.get(async (req: Request, res: Response) => {
    switch(await verify(req)) {
        case verify.status.OK:
        res.redirect(HttpCode.NO_CONTENT, `http://${clientInfo.ip}/${clientInfo.endpoints.login}`)
        break

        case verify.status.NOT_FOUND:
        res.status(HttpCode.NOT_FOUND).send('<h1>404 not found</h1>') //moze jak usune to bedzie zwykly 404
        break

        case verify.status.ERROR:
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send('<h1>Cannot confimed email!</h1>')
        break
    }
})

export default router