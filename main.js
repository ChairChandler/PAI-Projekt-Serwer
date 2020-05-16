const express = require('express')
const app = express()
const subRoutes = {
    tournament: require('./tournament/tournament').router,
    user: require('./user/user').router,
}

app.use('/', subRoutes.tournament, subRoutes.user) 
app.listen(2000, () => {
    console.log('Starting server done')
})