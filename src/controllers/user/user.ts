import express from 'express'
import loginRoute from './login/login'
import registerRoute from './register/register'

const router = express.Router()
router.use('/user', loginRoute, registerRoute) 

export default router