const express = require('express')
const router = express.Router()
const subRoutes = {
    contestant: require('./contestant/contestant'),
    general: require('./general/general')
}

router.use('/list', subRoutes.contestant, subRoutes.general) 

exports = router