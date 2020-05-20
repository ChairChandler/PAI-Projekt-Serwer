const mailer = require('nodemailer')
const UserModel = require.main.require('./models/users').User

async function signUp(data) {
    try {
        await UserModel.create(data)
        return true
    } catch(err) {
        return false
    }
}

exports.service = signUp