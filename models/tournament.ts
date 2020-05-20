const info = require.main.require('./config/database').sequelize
import SQL, { Model } from 'sequelize'
import User from './users'
import Logo from './logo'

class Tournament extends Model {
    public logo_group_id: Number

    public tournament_name: String
    public description: String
    public datetime: Date
    public localization_lat: Number
    public localization_lng: Number
    public participants_limit: Number
    public joining_deadline: Date
    public current_contestants_amount: Number

    public readonly createdAt: Date
    public readonly updatedAt: Date

    public static isAfterCurrentDay(val: Date) {
        const now = new Date()
        if(!(
            val.getFullYear() >= now.getFullYear() && 
            val.getMonth() >= now.getMonth() &&
            val.getDay() > now.getDay())) {
                throw Error("date have to be minimum 1 day later than the current date")
        }
    } 

    public static isBeforeTournamentDay(val: Date) {
        const td = this["datetime"]
        if(!(
            val.getFullYear() <= td.getFullYear() && 
            val.getMonth() <= td.getMonth() &&
            val.getDay() < td.getDay())) {
                throw Error("date have to be minimum 1 day before the tournament date")
        }
    } 
}

Tournament.init({
    logo_group_id: {
        type: SQL.INTEGER,
        unique: true
    },
    tournament_name: {
        type: SQL.STRING, 
        allowNull: false,
        validate: {len: [8, 24]}
    },
    description: {
        type: SQL.STRING,
        validate: {len: [0, 255]}
    },
    datetime: {
        type: SQL.DATE,
        allowNull: false,
        validate: {isAfterCurrentDay: Tournament.isAfterCurrentDay}
    },
    localization_lat: {
        type: SQL.FLOAT,
        allowNull: false,
        validate: {min: -90, max: 90}
    },
    localization_lng: {
        type: SQL.FLOAT,
        allowNull: false,
        validate: {min: -180, max: 180}
    },
    participants_limit: SQL.INTEGER.UNSIGNED,
    joining_deadline: {
        type: SQL.DATE,
        allowNull: false,
        validate: {
            isAfterCurrentDay: Tournament.isAfterCurrentDay,
            isBeforeTournamentDay: Tournament.isBeforeTournamentDay
        }
    },
    current_contestants_amount: {
        type: SQL.INTEGER.UNSIGNED,
        defaultValue: 0
    }
}, {
    sequelize: new SQL.Sequelize(info),
    tableName: 'tournament'
})

Tournament.hasOne(User)
Tournament.hasMany(Logo, {
    sourceKey: 'logo_group_id',
    foreignKey: 'group_id',
    as: 'logos'
})

Tournament.sync()

export default Tournament