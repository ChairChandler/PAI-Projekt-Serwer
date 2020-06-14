import smtp_config from 'config/smtp.json'
import SMTP from 'static/smtp'
import User from 'models/user'
import server_config from 'config/server.json'
import db from 'static/database'
import * as jwt from 'jsonwebtoken'
import crypto from 'crypto'
import * as API from 'api/login'
import Bcrypt from 'bcrypt'
import { decrypt } from 'init/generate-keys'
import LogicError from 'misc/logic-error'

export async function signIn(body: API.USER.LOGIN.POST.INPUT): Promise<{ user_id: number, token: string, expiresIn: number } | Error | LogicError> {
    try {
        body.password = decrypt(body.password)

        if (body.password.length < 8 || body.password.length > 16) {
            throw new LogicError('password must be between 8 and 16 characters')
        }

        const user = await User.findOne({
            where: { email: body.email }
        })

        if (!user) {
            throw new LogicError("invalid username or password")
        } else if (!Bcrypt.compareSync(body.password, user.password)) {
            throw new LogicError("invalid username or password")
        } else if (!user.registered) {
            throw new LogicError("user hasn't finished registration")
        }

        const id = crypto.randomBytes(64).toString('hex')
        const token = jwt.sign({ id: id }, server_config.token.secret, { expiresIn: server_config.token.expiresIn }) // 24 hours
        return { user_id: user.id, token, expiresIn: server_config.token.expiresIn }
    } catch (err) {
        console.error(err)
        return err
    }
}

export async function remindPassword(body: API.USER.LOGIN.GET.INPUT): Promise<void | Error | LogicError> {
    const t = await db.transaction()

    try {
        let user = await User.findOne({ where: { email: body.email } })
        if (!user) {
            throw new LogicError("invalid email")
        }

        const token = crypto.randomBytes(64).toString('hex')
        await user.update({ forgot_password_token: token }, { transaction: t })

        await SMTP.sendMail({
            from: smtp_config.from,
            to: body.email,
            subject: "Create new password",
            html: `
                <form action="http://${server_config.ip}:${server_config.port}/user/login/reset" method="post">
                    <input type="hidden" value="${token}" name="token">
                    <input type="hidden" value="${body.email}" name="email">
                    <div>
                    	<label for="password">Password</label>
                    	<input required type="password" id="password" name="password">
                    </div>
                    <div>
                    	<input type="submit" value="Submit">
                    </div>
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

export async function changePassword(body: API.USER.LOGIN.RESET.POST.INPUT): Promise<void | Error | LogicError> {
    const t = await db.transaction()
    try {
        const user = await User.findOne({ where: { email: body.email } })
        if (!user.forgot_password_token) {
            throw new LogicError("user hasn't requested a password change")
        } else if (body.password.length < 8 || body.password.length > 16) {
            throw new LogicError('password must be between 8 and 16 characters')
        } else if(body.token !== user.forgot_password_token) {
            throw new LogicError('invalid reset token')
        }

        const hash = Bcrypt.hashSync(body.password, server_config.saltRounds)
        await user.update({ password: hash, forgot_password_token: null }, { transaction: t })

        t.commit()
    } catch (err) {
        t.rollback()
        console.error(err)
        return err
    }
}
