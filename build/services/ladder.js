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
const sequelize_1 = require("sequelize");
const jobs_storage_1 = __importDefault(require("misc/jobs-storage"));
const node_schedule_1 = __importDefault(require("node-schedule"));
function shuffleAllTournaments() {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction({ isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE });
        try {
            const unfinished = yield tournament_1.default.findAll({ where: { finished: false }, transaction: t });
            for (const { id, datetime } of unfinished !== null && unfinished !== void 0 ? unfinished : []) {
                const job = node_schedule_1.default.scheduleJob(datetime, () => shuffleTournament(id));
                jobs_storage_1.default.setJob(id, job);
            }
            t.commit();
        }
        catch (err) {
            t.rollback();
            console.error(err);
        }
    });
}
exports.shuffleAllTournaments = shuffleAllTournaments;
function shuffleTournament(tournament_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction({ isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE });
        try {
            const contestants = yield contestants_1.default.findAll({ where: { tournament_id }, order: [['ranking_pos', 'DESC']] });
            const amount = contestants.length;
            let requiredNodes = 2 * amount - 2; // counting nodes from 0
            yield Promise.all(contestants.map(c => c.update({ node_id: requiredNodes-- })));
            t.commit();
        }
        catch (err) {
            t.rollback();
            console.error(err);
        }
    });
}
exports.shuffleTournament = shuffleTournament;
function getLadderInfo(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contestants = yield contestants_1.default.findAll({
                where: { tournament_id: body.tournament_id },
                order: [['ranking_pos', 'DESC']]
            });
            const data = yield Promise.all(contestants.map(({ node_id, user_id: id }) => __awaiter(this, void 0, void 0, function* () {
                const { name, lastname } = yield user_1.default.findOne({ where: { id } });
                return ({ id, node_id, name: `${name} ${lastname}` });
            })));
            return {
                nodes: contestants.length,
                contestants: data
            };
        }
        catch (err) {
            console.error(err);
            return err;
        }
    });
}
exports.getLadderInfo = getLadderInfo;
function setScore(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction({ isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE });
        try {
            const contestant = yield contestants_1.default.findOne({
                where: { tournament_id: body.tournament_id, user_id: body.contestant_id }, transaction: t
            });
            const winnerNode = Math.floor((contestant.node_id - 1) / 2);
            const enemyOnWinnerPos = yield contestants_1.default.findOne({
                where: { tournament_id: body.tournament_id, node_id: winnerNode }, transaction: t
            });
            if (enemyOnWinnerPos) {
                if (body.winner) {
                    let prevPosition = 2 * enemyOnWinnerPos.node_id + 1;
                    if (prevPosition == contestant.node_id) {
                        prevPosition++;
                    }
                    enemyOnWinnerPos.update({ node_id: prevPosition });
                    throw Error('winner-winner conflict');
                }
                else {
                    yield contestant.update({ defeated: true });
                }
            }
            else {
                if (body.winner) {
                    yield contestant.update({ defeated: false, node_id: winnerNode });
                }
                else {
                    throw Error('');
                }
            }
            t.commit();
        }
        catch (err) {
            console.error(err);
            return err;
        }
    });
}
exports.setScore = setScore;
