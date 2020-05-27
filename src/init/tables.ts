import db from 'static/database'
import User from 'models/user'
import Contestant from 'models/contestant'
import Tournament from 'models/tournament'
import Logo from 'models/logo'
import * as db_config from 'config/database.json'

export default async function init() {
    try {
        const conf = {force: db_config.force_init} // delete table during init server?
        if(db_config.force_init) {
            await db.query('SET FOREIGN_KEY_CHECKS = 0')
        }
        await User.sync(conf)
        await Contestant.sync(conf)
        await Logo.sync(conf)
        await Tournament.sync(conf)

        if(db_config.force_init) {
            await db.query('SET FOREIGN_KEY_CHECKS = 1')
        }
        console.log('sync database done')
    } catch(err) {
        console.error(err)
    }
}