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
const router = express_1.default.Router();
router.route('/login')
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield logging_1.signIn(req)) {
        res.status(http_status_codes_1.default.NO_CONTENT).send();
    }
    else {
        res.status(http_status_codes_1.default.NOT_FOUND).send();
    }
}))
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield logging_1.remindPassword(req)) {
        res.status(http_status_codes_1.default.NO_CONTENT).send();
    }
    else {
        res.status(http_status_codes_1.default.NOT_FOUND).send();
    }
}));
exports.default = router;
