import { Request, Response } from 'express'
import HttpCode from 'http-status-codes'

export default function Ping(req: Request, res: Response, next) {
    res.status(HttpCode.OK).send()
}