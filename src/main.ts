import express from 'express'
import endpoints from 'controllers/controller'
import config from 'config/server.json'
import client from 'config/client.json'
import models_init from 'init/tables'
import { QueryParamsToJson } from 'middlewares/query-params-middleware'
import { AccessLog } from 'middlewares/access-log-middleware'
import { PublicKey } from 'middlewares/public-key-middleware'
import cookieparser from 'cookie-parser'
import 'init/date'
import cors from 'cors'
import generateKeys from 'init/generate-keys'
import Ping from 'middlewares/ping-middleware'
import { shuffleAllTournaments } from 'services/ladder'

(async function main() {
    await generateKeys()
    await models_init()
    await shuffleAllTournaments()
    
    const app: express.Application = express()
    app
        .use(cors({ origin: `http://${client.ip}:${client.port}`, credentials: true }))
        .use(AccessLog())
        .use(cookieparser())
        .use(express.urlencoded({ limit: '50mb', extended: true }))
        .use(express.json({ limit: '50mb' }))
        .use(QueryParamsToJson())
        .use(endpoints)
        .use('/public-key', PublicKey())
        .use('/', Ping)

    app.listen(config.port, () => {
        console.log('starting server done')
    })
})()