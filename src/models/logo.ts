import db from '../static/database'
import * as SQL from 'sequelize'

class Logo extends SQL.Model {
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
    sequelize: db,
    tableName: 'logos'
})

export default Logo