const express = require('express')
const router = express.Router()
const subRoutes = {
    contestants: require('./contestants/contestants'),
    info: require('./info/info'),
    ladder: require('./ladder/ladder'),
    list: require('./list/list')
}

router.use('/tournament', subRoutes.contestants, subRoutes.info, subRoutes.ladder, subRoutes.list) 

exports = router