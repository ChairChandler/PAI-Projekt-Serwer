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
const token_middleware_1 = require("middlewares/token-middleware");
const reset_1 = __importDefault(require("./reset/reset"));
const my_error_1 = __importDefault(require("misc/my-error"));
const router = express_1.default.Router();
router.route('/login')
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield logging_1.signIn(req.body);
    if (!(data instanceof Error)) {
        res.cookie('id', data.user_id, { httpOnly: true });
        res.cookie('token', data.token, { maxAge: data.expiresIn * 1000, httpOnly: true });
        res.sendStatus(http_status_codes_1.default.OK);
    }
    else {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(data instanceof my_error_1.default ? data.message : 'cannot sign in');
    }
}))
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let err = yield logging_1.remindPassword(req.body);
    if (!err) {
        res.sendStatus(http_status_codes_1.default.NO_CONTENT);
    }
    else {
        res.status(http_status_codes_1.default.NOT_FOUND).send(err instanceof my_error_1.default ? err.message : 'cannot do that action');
    }
}))
    .delete(token_middleware_1.TokenMiddleware(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('id', '', { maxAge: 0 }).cookie('token', '', { maxAge: 0 });
    res.sendStatus(http_status_codes_1.default.NO_CONTENT);
}));
router.use('/login', reset_1.default);
exports.default = router;
