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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const logging_1 = require("services/logging");
const reset_1 = __importDefault(require("./reset/reset"));
const router = express_1.default.Router();
router.route('/login')
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token_info = yield logging_1.signIn(req.body);
    if (token_info) {
        res.cookie('token', token_info.token, { maxAge: token_info.expiresIn * 1000, httpOnly: true });
        res.sendStatus(http_status_codes_1.default.OK);
    }
    else {
        res.sendStatus(http_status_codes_1.default.INTERNAL_SERVER_ERROR);
    }
}))
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield logging_1.remindPassword(req.body)) {
        res.sendStatus(http_status_codes_1.default.NO_CONTENT);
    }
    else {
        res.sendStatus(http_status_codes_1.default.NOT_FOUND);
    }
}));
router.use('/login', reset_1.default);
exports.default = router;
