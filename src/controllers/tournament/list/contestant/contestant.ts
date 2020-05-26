import express, { Request, Response}from 'express'
import { TokenMiddleware } from 'utils/token-middleware'

const router = express.Router()

router.route('/contestant')
.get(TokenMiddleware(), async (req: Request, res: Response) => { // get contestant future tournaments list

})

export default router