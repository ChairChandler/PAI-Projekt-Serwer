const express = require('express')
const router = express.Router()
const subRoutes = {
    login: require('./login/login'),
    register: require('./register/register')
}

router.use('/user', subRoutes.login, subRoutes.register) 

exports = router