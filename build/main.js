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
const controller_1 = __importDefault(require("controllers/controller"));
const server_json_1 = __importDefault(require("config/server.json"));
const tables_1 = __importDefault(require("init/tables"));
const query_params_middleware_1 = require("middlewares/query-params-middleware");
const access_log_middleware_1 = require("middlewares/access-log-middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("init/date");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield tables_1.default();
        const app = express_1.default();
        app.use(access_log_middleware_1.AccessLog());
        app.use(cookie_parser_1.default());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json());
        app.use(query_params_middleware_1.QueryParamsToJson());
        app.use(controller_1.default);
        app.listen(server_json_1.default.port, () => {
            console.log('starting server done');
        });
    });
}
main();
