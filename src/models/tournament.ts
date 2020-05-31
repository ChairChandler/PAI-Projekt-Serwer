import db from '../static/database'
import * as SQL from 'sequelize'
import User from './user'

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
        if(new Date().getOnlyDate().getTime() >= val.getOnlyDate().getTime()) {
            throw Error("date have to be minimum 1 day later than the current date")
        }
    } 

    public static isBeforeTournamentDay(val: Date) {
        if(val.getOnlyDate().getTime() >= this["datetime"].getOnlyDate().getTime()) {
            throw Error("date have to be minimum 1 day before the tournament date")
        }
    } 
}

Tournament.init({
    id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    owner_id: { //one user can be a organizer of many tournaments
        type: SQL.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    tournament_name: {
        type: SQL.STRING, 
        allowNull: false,
        unique: true,
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

export default Tournament