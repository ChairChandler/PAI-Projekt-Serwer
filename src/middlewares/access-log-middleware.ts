import { Request, Response } from 'express'
import colors from 'colors'

export function AccessLog() {
    return (req: Request, res: Response, next) => {
        const date = `DATE(${new Date()})`
        const ip = `IP(${req.ip})`
        const path = `PATH(${req.path})`
        const method = `METHOD(${req.method})`
        console.log(colors.white(date), colors.green(ip), colors.magenta(path), colors.yellow(method))
        next()
    }
}
