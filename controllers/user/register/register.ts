import express = require('express')
const router = express.Router()
const HttpCode = require('http-status-codes')

const register = require.main.require('./services/registration').service

// sign up
router.route('/register')
.post(async (req, res) => {
    if(await register(req.body)) {
        res.sendStatus(HttpCode.CREATED)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})

exports.router = router