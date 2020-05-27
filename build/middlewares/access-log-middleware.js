"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
function AccessLog() {
    return (req, res, next) => {
        const ip = `IP(${req.ip})`;
        const path = `PATH(${req.path})`;
        const method = `METHOD(${req.method})`;
        console.log(colors_1.default.green(ip), colors_1.default.magenta(path), colors_1.default.yellow(method));
        next();
    };
}
exports.AccessLog = AccessLog;
