import db from '../static/database'
import * as SQL from 'sequelize'
import Contestant from './contestant'

class User extends SQL.Model {
    public id: Number
    public name: String
    public lastname: String
    public email: String
    public password: String
    public logged: Boolean
    public registered: Boolean

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

User.init({
    id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: SQL.STRING, 
        allowNull: false, 
        validate: {isAlpha: true}
    },
    lastname: {
        type: SQL.STRING, 
        allowNull: false, 
        validate: {isAlpha: true}
    },
    email: {
        type: SQL.STRING, 
        allowNull: false,
        unique: true, 
        validate: {isEmail: true}
    },
    password: {
        type: SQL.STRING, 
        allowNull: false, 
        validate: {len: [8, 16]}
    },
    logged: {
        type: SQL.BOOLEAN, 
        allowNull: false, 
        defaultValue: false
    },
    registered: {
        type: SQL.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, 
{
    sequelize: db,
    tableName: 'users'
})

User.hasMany(Contestant) //one user can be a participant in many tournaments
Contestant.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' }) // countestant is associated with one user account

export default User