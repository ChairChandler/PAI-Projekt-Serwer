import db from '../static/database'
import * as SQL from 'sequelize'
import User from './user'
import Logo from './logo'
import Contestant from './contestant'

class Tournament extends SQL.Model {
    public id: number
    public owner_id: number
    public tournament_name: string
    public description: string | null
    public datetime: Date
    public localization_lat: number //latitude
    public localization_lng: number //longitude
    public participants_limit: number | null
    public joining_deadline: Date
    public current_contestants_amount: number

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
    id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    owner_id: {
        type: SQL.INTEGER.UNSIGNED,
        allowNull: false
    },
    tournament_name: {
        type: SQL.STRING, 
        allowNull: false,
        primaryKey: true,
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
    participants_limit: {
        type: SQL.INTEGER.UNSIGNED,
        defaultValue: null
    },
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
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: db,
    tableName: 'tournaments'
})

Tournament.hasMany(Logo, { foreignKey: { allowNull: false }, onDelete: 'CASCADE', hooks: true}) // tournament can have many logos
Tournament.hasMany(Contestant, { foreignKey: { field: 'tournament_id', allowNull: false }, onDelete: 'CASCADE', hooks: true}) // contestant takes part in one tournament
User.hasMany(Tournament, {foreignKey: {field: 'owner_id', allowNull: false}, onDelete: 'CASCADE', hooks: true}) //one user can be a organizer of many tournaments

export default Tournament