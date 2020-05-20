const info = require.main.require('./config/database').sequelize
import SQL, { Model } from 'sequelize'

class Logo extends Model {
    public group_id: Number
    public logo: Blob

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

Logo.init({
    id: {
        type: SQL.INTEGER.UNSIGNED,
        allowNull: false
    },
    logo: {
        type: SQL.BLOB,
        allowNull: false
    }
}, 
{
    sequelize: new SQL.Sequelize(info),
    tableName: 'logo'
})

Logo.sync()

export default Logo