"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function QueryParamsToJson() {
    return (req, res, next) => {
        req.query = req.body = Object.assign(Object.assign({}, req.body), req.query);
        next();
    };
}
exports.QueryParamsToJson = QueryParamsToJson;
