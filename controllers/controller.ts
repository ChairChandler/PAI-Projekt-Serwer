import express = require('express')
const router = express.Router()
const subRoutes = {
    tournament: require('./tournament/tournament').router,
    user: require('./user/user').router,
}

router.use('/', subRoutes.tournament, subRoutes.user)

exports.router = router