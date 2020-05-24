"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contestant_1 = __importDefault(require("./contestant/contestant"));
const general_1 = __importDefault(require("./general/general"));
const router = express_1.default.Router();
router.use('/list', contestant_1.default, general_1.default);
exports.default = router;
