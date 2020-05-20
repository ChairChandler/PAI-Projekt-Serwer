import express from 'express'
const endpoints = require('./controllers/controller').router
import config from './config/server.json'
const app: express.Application = express()


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(endpoints)

app.listen(config.port, () => {
    console.log('Starting server done')
})