import config from 'config/database.json'
import { Sequelize } from 'sequelize'
config.sequelize["dialect"] = "mysql" // cannot be retrieved from config, sequelize/typescript conversion bug
export default new Sequelize(config.sequelize)
