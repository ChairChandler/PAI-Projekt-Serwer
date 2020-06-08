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
const contestants_1 = __importDefault(require("models/contestants"));
const tournament_1 = __importDefault(require("models/tournament"));
const user_1 = __importDefault(require("models/user"));
const database_1 = __importDefault(require("static/database"));
const my_error_1 = __importDefault(require("misc/my-error"));
function createContestant(body, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction();
        try {
            const now = new Date().getOnlyDate().getTime();
            const tinfo = yield tournament_1.default.findOne({ where: { id: body.tournament_id } });
            if (tinfo.current_contestants_amount == tinfo.participants_limit) {
                throw new my_error_1.default('reached maximum participants limit');
            }
            else if (now >= tinfo.datetime.getOnlyDate().getTime() || now >= tinfo.joining_deadline.getOnlyDate().getTime()) {
                throw new my_error_1.default('exceeded joining deadline');
            }
            yield Promise.all([
                contestants_1.default.create({
                    user_id: id,
                    tournament_id: body.tournament_id,
                    license_id: body.license_id,
                    ranking_pos: body.ranking_pos
                }, { transaction: t }),
                tinfo.update({
                    current_contestants_amount: tinfo.current_contestants_amount + 1
                }, { transaction: t })
            ]);
            t.commit();
        }
        catch (err) {
            t.rollback();
            console.error(err);
            return err;
        }
    });
}
exports.createContestant = createContestant;
function getContestants(body, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data;
            const tournament = yield tournament_1.default.findOne({ where: { id: body.tournament_id } });
            if (tournament.owner_id === id) {
                data = [];
                const contestants = yield contestants_1.default.findAll({ where: { tournament_id: body.tournament_id } });
                for (const c of contestants) {
                    const { name, lastname } = yield user_1.default.findOne({ where: { id: c.user_id } });
                    data.push({ user_id: c.user_id, name, lastname });
                }
            }
            else { // not owner, asking if taking part in tournament
                const contestant = yield contestants_1.default.findOne({ where: { user_id: id } });
                data = { taking_part: contestant ? true : false };
            }
            return data;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    });
}
exports.getContestants = getContestants;
