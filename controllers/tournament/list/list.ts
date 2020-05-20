import express = require('express')
const router = express.Router()
const subRoutes = {
    contestant: require('./contestant/contestant').router,
    general: require('./general/general').router
}

router.use('/list', subRoutes.contestant, subRoutes.general) 

exports.router = router