"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smtp_json_1 = __importDefault(require("config/smtp.json"));
const nodemailer_1 = require("nodemailer");
exports.default = nodemailer_1.createTransport(smtp_json_1.default.connection);
