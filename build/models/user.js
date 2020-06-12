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
class User extends SQL.Model {
}
User.init({
    id: {
        type: SQL.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: SQL.STRING,
        allowNull: false,
        validate: { isAlpha: true }
    },
    lastname: {
        type: SQL.STRING,
        allowNull: false,
        validate: { isAlpha: true }
    },
    email: {
        type: SQL.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: SQL.STRING,
        allowNull: false
    },
    registered: {
        type: SQL.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    forgot_password: {
        type: SQL.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: database_1.default,
    tableName: 'users'
});
exports.default = User;
