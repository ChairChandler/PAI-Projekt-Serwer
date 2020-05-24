"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = __importDefault(require("./login/login"));
const register_1 = __importDefault(require("./register/register"));
const router = express_1.default.Router();
router.use('/user', login_1.default, register_1.default);
exports.default = router;
