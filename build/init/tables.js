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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("static/database"));
const user_1 = __importDefault(require("models/user"));
const contestants_1 = __importDefault(require("models/contestants"));
const tournament_1 = __importDefault(require("models/tournament"));
const logo_1 = __importDefault(require("models/logo"));
const db_config = __importStar(require("config/database.json"));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conf = { force: db_config.force_init }; // delete table during init server?
            if (db_config.force_init) {
                yield database_1.default.query('SET FOREIGN_KEY_CHECKS = 0');
            }
            yield Promise.all([
                user_1.default.sync(conf),
                contestants_1.default.sync(conf),
                logo_1.default.sync(conf),
                tournament_1.default.sync(conf)
            ]);
            if (db_config.force_init) {
                yield database_1.default.query('SET FOREIGN_KEY_CHECKS = 1');
            }
            console.log('sync database done');
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = init;
