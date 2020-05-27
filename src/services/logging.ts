import smtp_config from 'config/smtp.json'
import SMTP from 'static/smtp'
import User from 'models/user'
import server_config from 'config/server.json'
import db from 'static/database'
import * as jwt from 'jsonwebtoken'
import * as Crypto from 'crypto'
import * as API from 'api/login'

export async function signIn(body: API.USER.LOGIN.PUT.INPUT): Promise<{user_id: number, token: string, expiresIn: number}|null> {
    try {
        const user = await User.findOne({
            where: {
                email: body.email,
                password: body.password
            }
        })

        if(!user) {
            throw Error("user not found")
        } else if(!user.registered) {
            throw Error("user hasn't finished registration")
        }
        
        const id =  Crypto.randomBytes(64).toString('hex')
        const token = jwt.sign({id: id}, server_config.token.secret, {expiresIn: server_config.token.expiresIn}) // 24 hours
        return {user_id: user.id, token: token, expiresIn: server_config.token.expiresIn}
    } catch(err) {
        console.error(err)
        return null
    }
}

export async function remindPassword(body: API.USER.LOGIN.GET.INPUT): Promise<Boolean> {
    const t = await db.transaction()
    
    try {
        let user = await User.findOne({where: {email: body.email}})
        if(!user) {
            throw Error("invalid email")
        }

        await user.update({forgot_password: true})

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
        return true
    } catch(err) {
        await t.rollback()
        console.error(err)
        return false
    }
}

export async function changePassword(body: API.USER.LOGIN.RESET.POST.INPUT): Promise<Boolean> {
    try {
        const user = await User.findOne({where: {email: body.email}})
        if(!user.forgot_password) {
            throw Error("user hasn't requested a password change")
        }

        await user.update({password: body.password, forgot_password: false})
        
        return true
    } catch(err) {
        console.error(err)
        return false
    }
}