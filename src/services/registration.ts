import smtp_config from 'config/smtp.json'
import SMTP from 'static/smtp'
import User from 'models/user'
import server_config from 'config/server.json'
import db from 'static/database'
import * as API from 'api/register'
import Bcrypt from 'bcrypt'
import { decrypt } from 'init/generate-keys'
import LogicError from 'misc/logic-error'

export async function signUp(body: API.USER.REGISTER.POST.INPUT): Promise<void | Error> {
    const t = await db.transaction()

    try {
        body.password = decrypt(body.password)
        body.password = Bcrypt.hashSync(body.password, server_config.saltRounds)

        const user = await User.create(body, { transaction: t })
        const href = `http://${server_config.ip}:${server_config.port}/user/register/verify?email=${user.email}&id=${user.id}`

        await SMTP.sendMail({
            from: smtp_config.from,
            to: body.email,
            subject: 'Finish registration',
            html: `<a href="${href}">Click to finish registration</a>`
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        console.error(err)
        return err
    }
}

export async function verify(body: API.USER.REGISTER.VERIFY.GET.INPUT): Promise<void | Error | LogicError> {
    const t = await db.transaction()
    try {
        const data = await User.findOne({
            where: {
                email: body.email,
                id: Number.parseInt(body.id)
            }
        })

        if (!data) {
            throw new LogicError("user not found")
        } else if (data.registered) {
            throw new LogicError("user has been registered before")
        }

        await data.update({ registered: true }, { transaction: t })
        t.commit()
    } catch (err) {
        t.rollback()
        console.error(err)
        return err
    }
}