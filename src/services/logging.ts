import smtp_config from 'config/smtp.json'
import SMTP from 'static/smtp'
import User from 'models/user'
import server_config from 'config/server.json'
import { Request } from 'express'

export async function signIn(data: Request): Promise<Boolean> {
    try {
        const user = await User.findOne({
            where: {
                email: data["email"],
                password: data["password"]
            }
        })

        user.logged = true
        return true
    } catch(err) {
        console.error(err)
        return false
    }
}

export async function remindPassword(data: Request): Promise<Boolean> {
    try {
        await User.findOne({where: {email: data["email"]}})
        await SMTP.sendMail({
            from: smtp_config.from,
            to: data["email"],
            subject: "Create new password",
            html: `
            <form method=POST action="http://${server_config.ip}${server_config.port}/user/login/reset">
                <input type="hidden" value="${data["email"]}" name="email">
                <label for="password"></label>
                <input type="password" id="password" name="password">
                <input type="submit">
            </form>
            `
        })
        return true
    } catch(err) {
        console.error(err)
        return false
    }
}

export async function changePassword(data: Request): Promise<Boolean> {
    try {
        const user = await User.findOne({where: {email: data["email"]}})
        user.password = data["password"]
        return true
    } catch(err) {
        console.error(err)
        return false
    }
}