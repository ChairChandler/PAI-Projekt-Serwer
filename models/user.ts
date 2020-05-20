const info = require.main.require('./config/database').sequelize
import SQL, { Model } from 'sequelize'

class User extends Model {
    public name: String
    public lastname: String
    public email: String
    public password: String
    public logged: Boolean

    public readonly createdAt: Date
    public readonly updatedAt: Date
}

User.init({
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
    }
}, 
{
    sequelize: new SQL.Sequelize(info),
    tableName: 'user'
})

User.sync()

export default User