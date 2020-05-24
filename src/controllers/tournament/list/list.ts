import express from 'express'
import contestantsRoute from './contestant/contestant'
import generalRoute from './general/general'

const router = express.Router()
router.use('/list', contestantsRoute, generalRoute) 

export default router