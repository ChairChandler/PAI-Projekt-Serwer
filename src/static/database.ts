import config from 'config/database.json'
import { Sequelize } from 'sequelize'
config.sequelize["dialect"] = "mysql"
export default new Sequelize(config.sequelize)