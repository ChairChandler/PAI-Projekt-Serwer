import { Request, Response } from 'express'

export function QueryParamsToJson() {
    return (req: Request, res: Response, next) => { // middleware responsible for make union of json body and query params
        req.query = req.body = {...req.body, ...req.query}
        next()
    }
}