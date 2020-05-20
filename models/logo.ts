const info = require.main.require('./config/database').sequelize
import SQL, { Model } from 'sequelize'
import Tournament from './tournament'

class Logo extends Model {
    public logo: Blob

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

Logo.init({
    logo: {
        type: SQL.BLOB,
        allowNull: false
    }
}, 
{
    sequelize: new SQL.Sequelize(info),
    tableName: 'logos'
})

Logo.belongsTo(Tournament, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' }) // logo is attach only to one tournament

export default Logo