"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../static/database"));
const SQL = __importStar(require("sequelize"));
const user_1 = __importDefault(require("./user"));
const logo_1 = __importDefault(require("./logo"));
const contestant_1 = __importDefault(require("./contestant"));
class Tournament extends SQL.Model {
    static isAfterCurrentDay(val) {
        const now = new Date();
        if (!(val.getFullYear() >= now.getFullYear() &&
            val.getMonth() >= now.getMonth() &&
            val.getDay() > now.getDay())) {
            throw Error("date have to be minimum 1 day later than the current date");
        }
    }
    static isBeforeTournamentDay(val) {
        const td = this["datetime"];
        if (!(val.getFullYear() <= td.getFullYear() &&
            val.getMonth() <= td.getMonth() &&
            val.getDay() < td.getDay())) {
            throw Error("date have to be minimum 1 day before the tournament date");
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
        validate: { len: [8, 24] }
    },
    description: {
        type: SQL.STRING,
        validate: { len: [0, 255] }
    },
    datetime: {
        type: SQL.DATE,
        allowNull: false,
        validate: { isAfterCurrentDay: Tournament.isAfterCurrentDay }
    },
    localization_lat: {
        type: SQL.FLOAT,
        allowNull: false,
        validate: { min: -90, max: 90 }
    },
    localization_lng: {
        type: SQL.FLOAT,
        allowNull: false,
        validate: { min: -180, max: 180 }
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
    sequelize: database_1.default,
    tableName: 'tournaments'
});
Tournament.hasMany(logo_1.default, { foreignKey: { allowNull: false }, onDelete: 'CASCADE', hooks: true }); // tournament can have many logos
Tournament.hasMany(contestant_1.default, { foreignKey: { field: 'tournament_id', allowNull: false }, onDelete: 'CASCADE', hooks: true }); // contestant takes part in one tournament
user_1.default.hasMany(Tournament, { foreignKey: { field: 'owner_id', allowNull: false }, onDelete: 'CASCADE', hooks: true }); //one user can be a organizer of many tournaments
exports.default = Tournament;
