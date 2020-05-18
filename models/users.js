const info = require.main.require('./config/database').sequelize
const Sequelize = require('sequelize').Sequelize
const conn = new Sequelize(info)

const User = conn.define('user', {
    name: {
        type: Sequelize.STRING, 
        allowNull: false, 
        validate: {isAlpha: true}
    },
    lastname: {
        type: Sequelize.STRING, 
        allowNull: false, 
        validate: {isAlpha: true}
    },
    email: {
        type: Sequelize.STRING, 
        primaryKey: true, 
        validate: {isEmail: true}
    },
    password: {
        type: Sequelize.STRING, 
        allowNull: false, 
        validate: {len: [8, 16]}
    },
    logged: {
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: false
    }
})

User.sync()

exports.User = User