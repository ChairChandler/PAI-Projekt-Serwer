import express from 'express'
import endpoints from 'controllers/controller'
import config from 'config/server.json'
import models_init from 'init/tables'
import { QueryParamsToJson } from 'middlewares/query-params-middleware'
import { AccessLog } from 'middlewares/access-log-middleware'
import cookieparser from 'cookie-parser'

async function main() {
    await models_init()
    const app: express.Application = express()

    app.use(AccessLog())
    app.use(cookieparser())
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    app.use(QueryParamsToJson())
    app.use(endpoints)

    app.listen(config.port, () => {
        console.log('starting server done')
    })
}

main()