"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tournament_1 = __importDefault(require("./tournament/tournament"));
const user_1 = __importDefault(require("./user/user"));
const router = express_1.default.Router();
router.use('/', tournament_1.default, user_1.default);
exports.default = router;
