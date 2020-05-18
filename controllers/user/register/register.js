const router = require('express').Router()
const HttpCode = require('http-status-codes')

const register = require.main.require('./services/registration').service

router.route('/register')
.post((req, res) => { // sign up
    (async () => {
        if(await register(req.body)) {
            res.sendStatus(HttpCode.CREATED)
        } else {
            res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
        }
    })()
})

exports.router = router