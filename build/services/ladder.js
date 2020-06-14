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
const jobs_storage_1 = __importDefault(require("static/jobs-storage"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const logic_error_ts_1 = __importDefault(require("misc/logic-error.ts"));
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
        let t = yield database_1.default.transaction({ isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE });
        try {
            const tournament = yield tournament_1.default.findOne({ where: { id: body.tournament_id }, transaction: t });
            if (tournament.finished) {
                throw new logic_error_ts_1.default('tournament is finished, cannot change position');
            }
            const contestant = yield contestants_1.default.findOne({
                where: { tournament_id: body.tournament_id, user_id: body.contestant_id }, transaction: t
            });
            /* Example:
                Contestant node:
                1 or 2 -> winner node = 0, enemy loser node = 2 if cont node 1, 1 if cont node 2
                3 or 4 -> winner node = 1 enemy loser node = 4 if cont node 3, 3 if cont node 4
                and so on ...
    
            */
            const winnerNode = Math.floor((contestant.node_id - 1) / 2);
            const enemyLoserNode = 2 * winnerNode + ((Math.floor(contestant.node_id / 2) != winnerNode) ? 1 : 2);
            const enemy = yield contestants_1.default.findOne({
                where: {
                    tournament_id: body.tournament_id,
                    $or: [
                        { node_id: { $eq: winnerNode } },
                        { node_id: { $eq: enemyLoserNode } }
                    ]
                }, transaction: t
            });
            let error;
            if (enemy) {
                if (body.winner && enemy.defeated === false) { // WIN-WIN
                    yield enemy.update({ defeated: null, node_id: enemyLoserNode }, { transaction: t });
                    error = new logic_error_ts_1.default('winner-winner conflict');
                }
                else if (body.winner && enemy.defeated) { // WIN-LOSE
                    yield contestant.update({ defeated: null, node_id: winnerNode }, { transaction: t });
                }
                else if (!body.winner && enemy.defeated) { // LOSE-LOSE
                    yield enemy.update({ defeated: null }, { transaction: t });
                    error = new logic_error_ts_1.default('loser-loser conflict');
                }
                else if (!body.winner && !enemy.defeated) { // LOSE-WIN
                    yield Promise.all([
                        contestant.update({ defeated: true }, { transaction: t }),
                        enemy.update({ defeated: null, node_id: winnerNode }, { transaction: t })
                    ]);
                }
            }
            else {
                error = new logic_error_ts_1.default('enemy has not played with contestant');
            }
            if (error) {
                t.commit();
                t = null;
                throw error;
            }
            else if (!winnerNode) {
                yield tournament.update({ finished: true }, { transaction: t });
                t.commit();
            }
        }
        catch (err) {
            t === null || t === void 0 ? void 0 : t.rollback();
            console.error(err);
            return err;
        }
    });
}
exports.setScore = setScore;
