const mailer = require('nodemailer')
const User = require.main.require('./models/users').User

async function signUp(data) {
    try {
        await User.create(data)
        return true
    } catch(err) {
        return false
    }
}

exports.service = signUp