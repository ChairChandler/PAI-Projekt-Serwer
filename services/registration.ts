import smtp_config from 'config/smtp.json'
import SMTP from 'static/smtp'
import User from 'models/user'
import server_config from 'config/server.json'
import { Request } from 'express'

export async function signUp(data: Request): Promise<Boolean> {
    try {
        await User.sync()
        const user = await User.create(data)
        
        const href = `http://${server_config.ip}${server_config.port}/user/register/verify?email=${user["email"]}&id=${user["id"]}`

        await SMTP.sendMail({
            from: smtp_config.from,
            to: data["email"],
            subject: 'Finish registration',
            html: `<a href="${href}">Click to finish registration</a>`
        })
        return true
    } catch(err) {
        console.error(err)
        return false
    }
}

enum VerifyStatus {
    OK, NOT_FOUND, ERROR
}

export async function verify(req: Request): Promise<VerifyStatus> {
    try {
        const email: string = req.query["email"] as string
        const id: number = Number.parseInt(req.query["id"] as string)

        await User.sync()
        const data = await User.findOne({
            where: {
                email: email,
                id: id
            } 
        })

        if(data) {
            await data.update({
                registered: true
            })
            return VerifyStatus.OK
        } else {
            return VerifyStatus.NOT_FOUND
        }
    } catch(err) {
        console.error(err)
        return VerifyStatus.ERROR
    }
}

verify.status = VerifyStatus