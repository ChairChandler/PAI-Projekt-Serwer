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
function signUp(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_1.default.sync();
            const user = yield user_1.default.create(data);
            const href = `http://${server_json_1.default.ip}${server_json_1.default.port}/user/register/verify?email=${user["email"]}&id=${user["id"]}`;
            yield smtp_1.default.sendMail({
                from: smtp_json_1.default.from,
                to: data["email"],
                subject: 'Finish registration',
                html: `<a href="${href}">Click to finish registration</a>`
            });
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
exports.signUp = signUp;
var VerifyStatus;
(function (VerifyStatus) {
    VerifyStatus[VerifyStatus["OK"] = 0] = "OK";
    VerifyStatus[VerifyStatus["NOT_FOUND"] = 1] = "NOT_FOUND";
    VerifyStatus[VerifyStatus["ERROR"] = 2] = "ERROR";
})(VerifyStatus || (VerifyStatus = {}));
function verify(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.query["email"];
            const id = Number.parseInt(req.query["id"]);
            yield user_1.default.sync();
            const data = yield user_1.default.findOne({
                where: {
                    email: email,
                    id: id
                }
            });
            if (data) {
                yield data.update({
                    registered: true
                });
                return VerifyStatus.OK;
            }
            else {
                return VerifyStatus.NOT_FOUND;
            }
        }
        catch (err) {
            console.error(err);
            return VerifyStatus.ERROR;
        }
    });
}
exports.verify = verify;
verify.status = VerifyStatus;
