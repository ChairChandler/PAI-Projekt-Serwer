import express, { Request, Response } from 'express'
import verifyRoute from './verify/verify'
import HttpCode from 'http-status-codes'
import { signUp } from'services/registration'

const router = express.Router()

// sign up
router.route('/register')
.post(async (req: Request, res: Response) => {
    if(await signUp(req.body)) {
        res.status(HttpCode.CREATED).send()
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send()
    }
})

router.use('/register', verifyRoute)

export default router