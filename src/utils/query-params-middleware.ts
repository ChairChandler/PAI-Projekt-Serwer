import { Request, Response } from 'express'

export function QueryParamsToJson() {
    return (req: Request, res: Response, next: Function) => { // middleware responsible for make union of json body and query params
        req.body = Object.assign({}, req.body, req.query)
        req.query = req.body
        next()
    }
}