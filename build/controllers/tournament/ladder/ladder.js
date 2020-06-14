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
const token_middleware_1 = require("middlewares/token-middleware");
const ladder_1 = require("services/ladder");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const logic_error_1 = __importDefault(require("misc/logic-error"));
const router = express_1.default.Router();
router.route('/ladder')
    .get(token_middleware_1.TokenMiddleware(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield ladder_1.getLadderInfo(req.body);
    if (!(data instanceof Error)) {
        res.sendStatus(http_status_codes_1.default.OK);
    }
    else {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send('cannot send ladder');
    }
}))
    .put(token_middleware_1.TokenMiddleware(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield ladder_1.setScore(req.body);
    if (!(data instanceof Error)) {
        res.sendStatus(http_status_codes_1.default.OK);
    }
    else {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(data instanceof logic_error_1.default ? data.message : 'cannot update score');
    }
}));
exports.default = router;
