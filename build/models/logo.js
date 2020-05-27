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
class Logo extends SQL.Model {
}
Logo.init({
    id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    tournament_id: {
        type: SQL.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: tournament_1.default,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    logo: {
        type: SQL.BLOB,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    tableName: 'logos'
});
exports.default = Logo;
