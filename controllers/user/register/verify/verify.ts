import express = require('express')
const router = express.Router()
const HttpCode = require('http-status-codes')
const clientInfo = require.main.require('./config/client.json')

const verify = require.main.require('./services/registration').verify

// sign up
router.route('/verify')
.get(async (req, res) => {
    switch(await verify.function(req)) {
        case verify.status.OK:
        res.sendStatus(HttpCode.OK)
        res.redirect(`http://${clientInfo.ip}/${clientInfo.endpoints.login}`)
        break

        case verify.status.NOT_FOUND:
        res.sendStatus(HttpCode.NOT_FOUND)
        res.send('<h1>404 not found</h1>') //moze jak usune to bedzie zwykly 404
        break

        case verify.status.ERROR:
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
        res.send('<h1>Cannot confimed email!</h1>')
        break
    }
})

exports.router = router