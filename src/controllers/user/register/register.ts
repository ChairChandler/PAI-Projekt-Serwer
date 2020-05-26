import express, { Request, Response } from 'express'
import verifyRoute from './verify/verify'
import HttpCode from 'http-status-codes'
import { signUp } from'services/registration'

const router = express.Router()

// sign up
router.route('/register')
.post(async (req: Request, res: Response) => {
    if(await signUp(req.body)) {
        res.sendStatus(HttpCode.CREATED)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})

router.use('/register', verifyRoute)

export default router