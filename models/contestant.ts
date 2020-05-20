const info = require.main.require('./config/database').sequelize
import SQL, { Model } from 'sequelize'

class Contestant extends Model {

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

Contestant.init({
    
}, 
{
    sequelize: new SQL.Sequelize(info),
    tableName: 'contestant'
})

Contestant.sync()

export default Contestant