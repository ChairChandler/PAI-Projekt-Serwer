import express from 'express'
import endpoints from 'controllers/controller'
import config from 'config/server.json'
import models_init from 'init/tables'
import { QueryParamsToJson } from 'utils/query-params-middleware'

async function main() {
    await models_init()
    const app: express.Application = express()

    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    app.use(QueryParamsToJson())
    app.use(endpoints)

    app.listen(config.port, () => {
        console.log('starting server done')
    })
}

main()