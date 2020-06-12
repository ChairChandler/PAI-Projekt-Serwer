import db from '../static/database'
import * as SQL from 'sequelize'

class User extends SQL.Model {
    public id: number
    public name: string
    public lastname: string
    public email: string
    public password: string
    public registered: boolean
    public forgot_password: boolean

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

User.init({
    id: {
        type: SQL.INTEGER.UNSIGNED,
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
        allowNull: false
    },
    registered: {
        type: SQL.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    forgot_password: {
        type: SQL.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},  {
    sequelize: db,
    tableName: 'users'
})

export default User