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
const database_1 = __importDefault(require("static/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generate_keys_1 = require("init/generate-keys");
const logic_error_1 = __importDefault(require("misc/logic-error"));
function signUp(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction();
        try {
            body.password = generate_keys_1.decrypt(body.password);
            body.password = bcrypt_1.default.hashSync(body.password, server_json_1.default.saltRounds);
            const user = yield user_1.default.create(body, { transaction: t });
            const href = `http://${server_json_1.default.ip}:${server_json_1.default.port}/user/register/verify?email=${user.email}&id=${user.id}`;
            yield smtp_1.default.sendMail({
                from: smtp_json_1.default.from,
                to: body.email,
                subject: 'Finish registration',
                html: `<a href="${href}">Click to finish registration</a>`
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
exports.signUp = signUp;
function verify(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction();
        try {
            const data = yield user_1.default.findOne({
                where: {
                    email: body.email,
                    id: Number.parseInt(body.id)
                }
            });
            if (!data) {
                throw new logic_error_1.default("user not found");
            }
            else if (data.registered) {
                throw new logic_error_1.default("user has been registered before");
            }
            yield data.update({ registered: true }, { transaction: t });
            t.commit();
        }
        catch (err) {
            t.rollback();
            console.error(err);
            return err;
        }
    });
}
exports.verify = verify;
