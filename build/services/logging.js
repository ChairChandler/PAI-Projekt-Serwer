"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smtp_json_1 = __importDefault(require("config/smtp.json"));
const smtp_1 = __importDefault(require("static/smtp"));
const user_1 = __importDefault(require("models/user"));
const server_json_1 = __importDefault(require("config/server.json"));
function signIn(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findOne({
                where: {
                    email: data["email"],
                    password: data["password"]
                }
            });
            user.logged = true;
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
exports.signIn = signIn;
function remindPassword(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_1.default.findOne({ where: { email: data["email"] } });
            yield smtp_1.default.sendMail({
                from: smtp_json_1.default.from,
                to: data["email"],
                subject: "Create new password",
                html: `
            <form method=POST action="http://${server_json_1.default.ip}${server_json_1.default.port}/user/login/reset">
                <input type="hidden" value="${data["email"]}" name="email">
                <label for="password"></label>
                <input type="password" id="password" name="password">
                <input type="submit">
            </form>
            `
            });
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
exports.remindPassword = remindPassword;
function changePassword(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findOne({ where: { email: data["email"] } });
            user.password = data["password"];
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
exports.changePassword = changePassword;
