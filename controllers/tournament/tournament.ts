import express = require('express')
const router = express.Router()
const subRoutes = {
    contestants: require('../contestants/contestants').router,
    info: require('../info/info').router,
    ladder: require('../ladder/ladder').router,
    list: require('../list/list').router
}

router.use('/tournament', subRoutes.contestants, subRoutes.info, subRoutes.ladder, subRoutes.list) 

exports.router = router