const info = require.main.require('./config/database').sequelize
import SQL, { Model } from 'sequelize'
import User from './user'
import Tournament from './tournament'

class Contestant extends Model {
    public tournament_id: Number
    public license_id: String
    public ranking_pos: Number
    public node_id: Number | null

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
    sequelize: new SQL.Sequelize(info),
    tableName: 'contestants'
})

Contestant.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' }) // countestant is associated with one user account
Contestant.belongsTo(Tournament, { foreignKey: { field: 'tournament_id', allowNull: false }, onDelete: 'CASCADE' }) // contestant takes part in one tournament

export default Contestant