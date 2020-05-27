import express, { Request, Response}from 'express'
import { TokenMiddleware } from 'middlewares/token-middleware'

const router = express.Router()

router.route('/contestants')
.post(TokenMiddleware(), async (req: Request, res: Response) => { // add contestant to the tournament
    res.sendStatus(200).send('OK')
})
.get(TokenMiddleware(), async (req: Request, res: Response) => { // get tournament contestants list
    
})

export default router