const info = require.main.require('./config/database').sequelize
import SQL, { Model } from 'sequelize'
import Tournament from './tournament'
import Contestant from './contestant'

class User extends Model {
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
        primaryKey: true, 
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
    sequelize: new SQL.Sequelize(info),
    tableName: 'users'
})

User.hasMany(Tournament) //one user can be a organizer of many tournaments
User.hasMany(Contestant) //one user can be a participant in many tournaments

export default User