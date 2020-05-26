import db from '../static/database'
import * as SQL from 'sequelize'

class Contestant extends SQL.Model {
    public tournament_id: number
    public license_id: string
    public ranking_pos: number
    public node_id: number | null

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

Contestant.init({
    tournament_id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true
    },
    license_id: {
        type: SQL.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
        validate: {len: [1, 255]}
    },
    ranking_pos: {
        type: SQL.INTEGER.UNSIGNED,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    node_id: {
        type: SQL.INTEGER.UNSIGNED,
        defaultValue: null
    }
}, 
{
    sequelize: db,
    tableName: 'contestants'
})

export default Contestant