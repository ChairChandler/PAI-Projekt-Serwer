const express = require('express')
const endpoints = require('./controllers/controller').router
const config = require('./config/server.json')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(endpoints)

app.listen(config.port, () => {
    console.log('Starting server done')
})