import { createTransport } from 'nodemailer'
const smtp_config = require.main.require('./config/smtp.json')
const server_config = require.main.require('./config/server')
const User  = require.main.require('./models/user').User

async function signUp(data): Promise<Boolean> {
    try {
        await User.sync()
        await User.create(data)
        const smtp = createTransport(smtp_config.connection)
        
        const href = `http://${server_config.ip}/user/register/verify?email=${data.email}&id=${data.id}`

        await smtp.sendMail({
            from: smtp_config.from,
            to: data.email,
            subject: 'Finish registration',
            html: `<a href="${href}">Click to finish registration</a>`
        })
        return true
    } catch(err) {
        return false
    }
}

enum VerifyStatus {
    OK, NOT_FOUND, ERROR
}

async function verify(req): Promise<VerifyStatus> {
    try {
        const email: String = req.query.email
        const id: Number = req.query.id

        await User.sync()
        const data = await User.find({
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
        return VerifyStatus.ERROR
    }
}

exports.signUp = signUp
exports.verify = {
    function: verify,
    status: VerifyStatus
}