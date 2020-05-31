import db from '../static/database'
import * as SQL from 'sequelize'
import Tournament from 'models/tournament'
import User from 'models/user'

class Contestant extends SQL.Model {
    public user_id: number
    public tournament_id: number
    public license_id: string
    public ranking_pos: number
    public node_id: number | null

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

Contestant.init({
    user_id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    tournament_id: { // contestant takes part in one tournament
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        references: {
            model: Tournament,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    license_id: {
        type: SQL.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {len: [1, 255]}
    },
    ranking_pos: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false
    },
    node_id: {
        type: SQL.INTEGER.UNSIGNED,
        defaultValue: null
    }
},  {
    sequelize: db,
    tableName: 'contestants'
})

export default Contestant