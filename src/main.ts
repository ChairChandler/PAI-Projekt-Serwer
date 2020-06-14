import express from 'express'
import endpoints from 'controllers/controller'
import config from 'config/server.json'
import client from 'config/client.json'
import models_init from 'init/tables'
import { QueryParamsToJson } from 'middlewares/query-params-middleware'
import { AccessLog } from 'middlewares/access-log-middleware'
import { PublicKey } from 'middlewares/public-key-middleware'
import cookieparser from 'cookie-parser'
import { shuffleContestants } from 'services/ladder'
import * as time from 'time-convert'
import 'init/date'
import cors from 'cors'
import generateKeys from 'init/generate-keys'
import Ping from 'middlewares/ping-middleware'

generateKeys(main)

async function main() {
    await models_init()
    const app: express.Application = express()

    app.use(cors({ origin: `http://${client.ip}:${client.port}`, credentials: true }))
    app.use(AccessLog())
    app.use(cookieparser())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(QueryParamsToJson())
    app.use(endpoints)
    app.use('/public-key', PublicKey())
    app.use('/', Ping)

    setInterval(async () => {
        const err = await shuffleContestants()
        if (err) {
            console.error(err)
        }
    }, time.d.to(time.ms)(1))

    app.listen(config.port, () => {
        console.log('starting server done')
    })
}
