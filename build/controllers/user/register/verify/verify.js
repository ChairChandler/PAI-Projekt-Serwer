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
const express_1 = __importDefault(require("express"));
const client_json_1 = __importDefault(require("config/client.json"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const registration_1 = require("services/registration");
const router = express_1.default.Router();
// sign up
router.route('/verify')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (yield registration_1.verify(req)) {
        case registration_1.verify.status.OK:
            res.redirect(http_status_codes_1.default.NO_CONTENT, `http://${client_json_1.default.ip}/${client_json_1.default.endpoints.login}`);
            break;
        case registration_1.verify.status.NOT_FOUND:
            res.status(http_status_codes_1.default.NOT_FOUND).send('<h1>404 not found</h1>'); //moze jak usune to bedzie zwykly 404
            break;
        case registration_1.verify.status.ERROR:
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send('<h1>Cannot confimed email!</h1>');
            break;
    }
}));
exports.default = router;
