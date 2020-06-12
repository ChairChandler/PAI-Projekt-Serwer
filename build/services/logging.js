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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const smtp_json_1 = __importDefault(require("config/smtp.json"));
const smtp_1 = __importDefault(require("static/smtp"));
const user_1 = __importDefault(require("models/user"));
const server_json_1 = __importDefault(require("config/server.json"));
const database_1 = __importDefault(require("static/database"));
const jwt = __importStar(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const my_error_1 = __importDefault(require("misc/my-error"));
const generate_keys_1 = require("init/generate-keys");
function signIn(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            body.password = generate_keys_1.decrypt(body.password);
            if (body.password.length < 8 || body.password.length > 16) {
                throw new Error('password must be between 8 and 16 characters');
            }
            const user = yield user_1.default.findOne({
                where: { email: body.email }
            });
            if (!(user && bcrypt_1.default.compareSync(body.password, user.password))) {
                console.log(body.password, user.password);
                throw new my_error_1.default("invalid username or password");
            }
            else if (!user.registered) {
                throw new my_error_1.default("user hasn't finished registration");
            }
            const id = crypto_1.default.randomBytes(64).toString('hex');
            const token = jwt.sign({ id: id }, server_json_1.default.token.secret, { expiresIn: server_json_1.default.token.expiresIn }); // 24 hours
            return { user_id: user.id, token, expiresIn: server_json_1.default.token.expiresIn };
        }
        catch (err) {
            console.error(err);
            return err;
        }
    });
}
exports.signIn = signIn;
function remindPassword(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction();
        try {
            let user = yield user_1.default.findOne({ where: { email: body.email } });
            if (!user) {
                throw new my_error_1.default("invalid email");
            }
            yield user.update({ forgot_password: true }, { transaction: t });
            yield smtp_1.default.sendMail({
                from: smtp_json_1.default.from,
                to: body.email,
                subject: "Create new password",
                html: `
                <form method="post" action="http://${server_json_1.default.ip}:${server_json_1.default.port}/user/login/reset">
                    <input type="hidden" value="${body.email}" name="email">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password">
                    <input type="submit" value="Submit">
                </form>
            `
            });
            yield t.commit();
        }
        catch (err) {
            yield t.rollback();
            console.error(err);
            return err;
        }
    });
}
exports.remindPassword = remindPassword;
function changePassword(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction();
        try {
            const user = yield user_1.default.findOne({ where: { email: body.email } });
            if (!user.forgot_password) {
                throw new my_error_1.default("user hasn't requested a password change");
            }
            else if (body.password.length < 8 || body.password.length > 16) {
                throw new Error('password must be between 8 and 16 characters');
            }
            const hash = bcrypt_1.default.hashSync(body.password, server_json_1.default.saltRounds);
            yield user.update({ password: hash, forgot_password: false }, { transaction: t });
            t.commit();
        }
        catch (err) {
            t.rollback();
            console.error(err);
            return err;
        }
    });
}
exports.changePassword = changePassword;
