"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const generate_keys_1 = require("init/generate-keys");
function PublicKey() {
    const { publicKey } = generate_keys_1.getKeys();
    return (req, res, next) => {
        res.status(http_status_codes_1.default.OK).send({ publicKey });
    };
}
exports.PublicKey = PublicKey;
