import express, {Request, Response} from 'express'
import { TokenMiddleware } from 'middlewares/token-middleware'

const router = express.Router()

router.route('/ladder')
.get(TokenMiddleware(), async (req: Request, res: Response) => { // get tournament ladder

})
.put(TokenMiddleware(), async (req: Request, res: Response) => { // modify ladder node winner

})

export default router