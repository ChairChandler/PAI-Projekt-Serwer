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
const tournament_1 = require("services/tournament");
const router = express_1.default.Router();
// get tournaments list
router.route('/general')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield tournament_1.getTournamentList(req.body);
    if (!(data instanceof Error)) {
        res.status(http_status_codes_1.default.OK).send(data);
    }
    else {
        res.status(http_status_codes_1.default.BAD_REQUEST).send('cannot retrieve tournaments list');
    }
}));
exports.default = router;
