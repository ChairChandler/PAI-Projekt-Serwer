import db from '../static/database'
import * as SQL from 'sequelize'
import Tournament from 'models/tournament'

class Logo extends SQL.Model {
    public id: number
    public tournament_id: number
    public logo: string | Buffer

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

Logo.init({
    id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    tournament_id: {
        type: SQL.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Tournament,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    logo: {
        type: SQL.TEXT({ length: 'long' }),
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'logos'
})

export default Logo