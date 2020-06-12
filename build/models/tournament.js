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
class Tournament extends SQL.Model {
    static isAfterCurrentDay(val) {
        if (new Date().getOnlyDate().getTime() >= val.getOnlyDate().getTime()) {
            throw Error("date have to be minimum 1 day later than the current date");
        }
    }
    static isBeforeTournamentDay(val) {
        if (val.getOnlyDate().getTime() >= this["datetime"].getOnlyDate().getTime()) {
            throw Error("date have to be minimum 1 day before the tournament date");
        }
    }
}
Tournament.init({
    id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    owner_id: {
        type: SQL.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: user_1.default,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    tournament_name: {
        type: SQL.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [8, 24] }
    },
    description: {
        type: SQL.TEXT({ length: 'long' }),
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
exports.default = Tournament;
