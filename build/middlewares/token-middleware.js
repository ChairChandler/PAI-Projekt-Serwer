"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwt = __importStar(require("jsonwebtoken"));
const server_json_1 = __importDefault(require("config/server.json"));
function TokenMiddleware() {
    return (req, res, next) => {
        const token = req.cookies["secure-token"];
        if (!token) {
            res.status(http_status_codes_1.default.UNAUTHORIZED).send({ message: 'No token provided.' });
            return;
        }
        jwt.verify(token, server_json_1.default.token.secret, (err, decoded) => {
            if (err) {
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send({ message: 'Failed to authenticate token.' });
            }
            else {
                next();
            }
        });
    };
}
exports.TokenMiddleware = TokenMiddleware;
