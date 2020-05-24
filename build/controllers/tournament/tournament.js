"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contestants_1 = __importDefault(require("./contestants/contestants"));
const info_1 = __importDefault(require("./info/info"));
const ladder_1 = __importDefault(require("./ladder/ladder"));
const list_1 = __importDefault(require("./list/list"));
const router = express_1.default.Router();
router.use('/tournament', contestants_1.default, info_1.default, ladder_1.default, list_1.default);
exports.default = router;
