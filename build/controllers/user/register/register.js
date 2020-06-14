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
const verify_1 = __importDefault(require("./verify/verify"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const registration_1 = require("services/registration");
const router = express_1.default.Router();
// sign up
router.route('/register')
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let err = yield registration_1.signUp(req.body);
    if (!err) {
        res.sendStatus(http_status_codes_1.default.CREATED);
    }
    else {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(err instanceof Error ? err.message : 'cannot sign up');
    }
}));
router.use('/register', verify_1.default);
exports.default = router;
