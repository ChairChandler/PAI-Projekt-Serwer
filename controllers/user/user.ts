import express = require('express')
const router = express.Router()
const subRoutes = {
    login: require('./login/login').router,
    register: require('./register/register').router
}

router.use('/user', subRoutes.login, subRoutes.register) 

exports.router = router