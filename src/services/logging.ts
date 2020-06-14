import smtp_config from 'config/smtp.json'
import SMTP from 'static/smtp'
import User from 'models/user'
import server_config from 'config/server.json'
import db from 'static/database'
import * as jwt from 'jsonwebtoken'
import crypto from 'crypto'
import * as API from 'api/login'
import Bcrypt from 'bcrypt'
import MyError from 'misc/my-error'
import { decrypt } from 'init/generate-keys'

export async function signIn(body: API.USER.LOGIN.POST.INPUT): Promise<{ user_id: number, token: string, expiresIn: number } | Error> {
    try {
        body.password = decrypt(body.password)

        if (body.password.length < 8 || body.password.length > 16) {
            throw new Error('password must be between 8 and 16 characters')
        }

        const user = await User.findOne({
            where: { email: body.email }
        })

	if(!user) {
	    throw new MyError("invalid username or password")
        } else if (!Bcrypt.compareSync(body.password, user.password)) {
            throw new MyError("invalid username or password")
        } else if (!user.registered) {
            throw new MyError("user hasn't finished registration")
        }

        const id = crypto.randomBytes(64).toString('hex')
        const token = jwt.sign({ id: id }, server_config.token.secret, { expiresIn: server_config.token.expiresIn }) // 24 hours
        return { user_id: user.id, token, expiresIn: server_config.token.expiresIn }
    } catch (err) {
        console.error(err)
        return err
    }
}

export async function remindPassword(body: API.USER.LOGIN.GET.INPUT): Promise<void | Error> {
    const t = await db.transaction()

    try {
        let user = await User.findOne({ where: { email: body.email } })
        if (!user) {
            throw new MyError("invalid email")
        }

        await user.update({ forgot_password: true }, { transaction: t })

        await SMTP.sendMail({
            from: smtp_config.from,
            to: body.email,
            subject: "Create new password",
            html: `
                <form method="post" action="http://${server_config.ip}:${server_config.port}/user/login/reset">
                    <input type="hidden" value="${body.email}" name="email">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password">
                    <input type="submit" value="Submit">
                </form>
            `
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        console.error(err)
        return err
    }
}

export async function changePassword(body: API.USER.LOGIN.RESET.POST.INPUT): Promise<void | Error> {
    const t = await db.transaction()
    try {
        const user = await User.findOne({ where: { email: body.email } })
        if (!user.forgot_password) {
            throw new MyError("user hasn't requested a password change")
        } else if (body.password.length < 8 || body.password.length > 16) {
            throw new Error('password must be between 8 and 16 characters')
        }

        const hash = Bcrypt.hashSync(body.password, server_config.saltRounds)
        await user.update({ password: hash, forgot_password: false }, { transaction: t })

        t.commit()
    } catch (err) {
        t.rollback()
        console.error(err)
        return err
    }
}
