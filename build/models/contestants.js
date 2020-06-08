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
const tournament_1 = __importDefault(require("models/tournament"));
const user_1 = __importDefault(require("models/user"));
class Contestant extends SQL.Model {
}
Contestant.init({
    user_id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        references: {
            model: user_1.default,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    tournament_id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        references: {
            model: tournament_1.default,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    license_id: {
        type: SQL.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        validate: { len: [1, 255] }
    },
    ranking_pos: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    node_id: {
        type: SQL.INTEGER.UNSIGNED,
        defaultValue: null
    }
}, {
    sequelize: database_1.default,
    tableName: 'contestants'
});
exports.default = Contestant;
