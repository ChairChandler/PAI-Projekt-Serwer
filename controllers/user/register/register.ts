import express from 'express'
const verifyRoute = require('./verify/verify')
const router = express.Router()
const HttpCode = require('http-status-codes')

const register = require.main.require('./services/registration').signUp

// sign up
router.route('/register')
.post(async (req, res) => {
    if(await register(req.body)) {
        res.sendStatus(HttpCode.CREATED)
    } else {
        res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR)
    }
})

router.use('/register', verifyRoute)

exports.router = router