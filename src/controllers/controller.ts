import express from 'express'
import tournamentRoute from './tournament/tournament'
import userRoute from './user/user'

const router = express.Router()
router.use('/', tournamentRoute, userRoute)

export default router