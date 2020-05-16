const express = require('express')
const app = express()
const subRoutes = {
    tournament: require('./tournament/tournament'),
    user: require('./user/user'),
}

app.use('/', subRoutes.tournament, subRoutes.user) 
