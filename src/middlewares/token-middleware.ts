import { Request, Response } from 'express'
import HttpCode from 'http-status-codes'
import * as jwt from 'jsonwebtoken'
import server_config from 'config/server.json'

export function TokenMiddleware() {
    return (req: Request, res: Response, next) => {
        const token = req.cookies["secure-token"] as string
        if(!token) {
            res.status(HttpCode.UNAUTHORIZED).send({message: 'No token provided.'})
            return
        }

        jwt.verify(token, server_config.token.secret, (err, decoded) => {
            if(err) {
                res.status(HttpCode.INTERNAL_SERVER_ERROR).send({message: 'Failed to authenticate token.'})
            } else {
                next()
            }
        })
    }
}