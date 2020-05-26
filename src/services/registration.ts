import smtp_config from 'config/smtp.json'
import SMTP from 'static/smtp'
import User from 'models/user'
import server_config from 'config/server.json'
import db from 'static/database'
import * as API from 'api/register'

export async function signUp(body: API.Register.Input): Promise<Boolean> {
    const t = await db.transaction()

    try {
        const user = await User.create(body, {transaction: t})
        const href = `http://${server_config.ip}:${server_config.port}/user/register/verify?email=${user["email"]}&id=${user["id"]}`
 
        await SMTP.sendMail({
            from: smtp_config.from,
            to: body.email,
            subject: 'Finish registration',
            html: `<a href="${href}">Click to finish registration</a>`
        })
        await t.commit()
        return true
    } catch(err) {
        await t.rollback()
        console.error(err)
        return false
    }
}

export async function verify(body: API.Verify.Input): Promise<Boolean> {
    try {
        const data = await User.findOne({
            where: {
                email: body.email,
                id: Number.parseInt(body.id)
            } 
        })

        if(!data) {
            throw Error("user not found")
        }

        if(data.registered) {
            throw Error("user has been registered before")
        }

        await data.update({registered: true})
        return true
    } catch(err) {
        console.error(err)
        return false
    }
}