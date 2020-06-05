import express, { Request, Response } from 'express'
import verifyRoute from './verify/verify'
import HttpCode from 'http-status-codes'
import { signUp } from'services/registration'
import MyError from 'misc/my-error'

const router = express.Router()

// sign up
router.route('/register')
.post(async (req: Request, res: Response) => {
    let err = await signUp(req.body)
    if(!err) {
        res.sendStatus(HttpCode.CREATED)
    } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err instanceof MyError ? err.message : 'cannot sign up')
    }
})

router.use('/register', verifyRoute)

export default router