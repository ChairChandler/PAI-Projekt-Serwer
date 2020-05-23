import express from 'express'
import contestantsRoute from './contestants/contestants'
import infoRoute from './info/info'
import ladderRoute from './ladder/ladder'
import listRoute from './list/list'

const router = express.Router()
router.use('/tournament', contestantsRoute, infoRoute, ladderRoute, listRoute) 

export default router