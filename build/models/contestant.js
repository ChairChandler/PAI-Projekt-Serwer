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
class Contestant extends SQL.Model {
}
Contestant.init({
    tournament_id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true
    },
    license_id: {
        type: SQL.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
        validate: { len: [1, 255] }
    },
    ranking_pos: {
        type: SQL.INTEGER.UNSIGNED,
        unique: true,
        primaryKey: true,
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
