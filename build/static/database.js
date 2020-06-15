"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_json_1 = __importDefault(require("config/database.json"));
const sequelize_1 = require("sequelize");
database_json_1.default.sequelize["dialect"] = "mysql"; // cannot be retrieved from config, sequelize/typescript conversion bug
exports.default = new sequelize_1.Sequelize(database_json_1.default.sequelize);
