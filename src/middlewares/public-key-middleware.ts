import { Request, Response } from 'express'
import HttpCode from 'http-status-codes'
import { getKeys } from 'init/generate-keys'

export function PublicKey() {
    const { publicKey } = getKeys()
    return (req: Request, res: Response, next) => {
        res.status(HttpCode.OK).send({ publicKey })
    }
}