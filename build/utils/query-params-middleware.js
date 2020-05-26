"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function QueryParamsToJson() {
    return (req, res, next) => {
        req.body = Object.assign({}, req.body, req.query);
        req.query = req.body;
        next();
    };
}
exports.QueryParamsToJson = QueryParamsToJson;
