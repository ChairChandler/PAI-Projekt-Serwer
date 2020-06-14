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
const tournament_1 = __importDefault(require("models/tournament"));
const user_1 = __importDefault(require("models/user"));
const contestants_1 = __importDefault(require("models/contestants"));
const logo_1 = __importDefault(require("models/logo"));
const database_1 = __importDefault(require("static/database"));
const my_error_1 = __importDefault(require("misc/my-error"));
function getTournamentList(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tournaments = yield tournament_1.default.findAll({ order: [['datetime', 'ASC']] });
            if (body.amount) {
                /*
                unfortunately cannot use limit prop due to casting non-literal to string (bug)
                which raise database error
                */
                tournaments = tournaments.slice(0, body.amount);
            }
            return tournaments.map(v => ({ id: v.id, name: v.tournament_name, date: v.datetime }));
        }
        catch (err) {
            console.error(err);
            return err;
        }
    });
}
exports.getTournamentList = getTournamentList;
function getTournamentInfo(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield tournament_1.default.findOne({ where: { id: body.tournament_id } });
            const owner = yield user_1.default.findOne({ where: { id: info.owner_id } });
            const logos = yield logo_1.default.findAll({ where: { tournament_id: body.tournament_id } });
            const imgData = [];
            for (const img of logos) {
                imgData.push({
                    id: img.id,
                    data: img.logo
                });
            }
            return {
                tournament_id: info.id,
                owner_id: info.owner_id,
                tournament_name: info.tournament_name,
                description: info.description,
                organizer: `${owner.name} ${owner.lastname}`,
                datetime: info.datetime,
                localization_lat: info.localization_lat,
                localization_lng: info.localization_lng,
                participants_limit: info.participants_limit,
                joining_deadline: info.joining_deadline,
                current_contestants_amount: info.current_contestants_amount,
                logos: imgData
            };
        }
        catch (err) {
            console.error(err);
            return err;
        }
    });
}
exports.getTournamentInfo = getTournamentInfo;
function createTournament(body, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction();
        try {
            const tournament = yield tournament_1.default.create({
                owner_id: id,
                tournament_name: body.tournament_name,
                description: body.description,
                datetime: body.datetime,
                localization_lat: body.localization_lat,
                localization_lng: body.localization_lng,
                participants_limit: body.participants_limit,
                joining_deadline: body.joining_deadline
            }, { transaction: t });
            for (const logo of body.logos) {
                yield logo_1.default.create({ tournament_id: tournament.id, logo });
            }
            yield t.commit();
        }
        catch (err) {
            yield t.rollback();
            console.error(err);
            return err;
        }
    });
}
exports.createTournament = createTournament;
function modifyTournament(body, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction();
        try {
            const tournament = yield tournament_1.default.findOne({ where: { id: body.tournament_id } });
            if (tournament.owner_id != id) {
                throw new my_error_1.default('unauthorized access to modify protected data');
            }
            const { tournament_name = tournament.tournament_name, description = tournament.description, datetime = tournament.datetime, localization_lat = tournament.localization_lat, localization_lng = tournament.localization_lng, participants_limit = tournament.participants_limit, joining_deadline = tournament.joining_deadline, } = body;
            // can be done using interleave, however i dont know if sequelize can handle with rollback for many tables
            yield tournament.update({
                tournament_name,
                description,
                datetime,
                localization_lat,
                localization_lng,
                participants_limit,
                joining_deadline
            }, { transaction: t });
            if (body.logos) {
                for (const l of body.logos) {
                    if (l.id) { // UPDATE OR REMOVE
                        if (l.data) { // UPDATE
                            yield logo_1.default.update({ logo: l.data }, { where: { id: l.id }, transaction: t });
                        }
                        else { // REMOVE
                            yield logo_1.default.destroy({ where: { id: l.id }, transaction: t });
                        }
                    }
                    else { // CREATE
                        yield logo_1.default.create({ tournament_id: body.tournament_id, logo: l.data }, { transaction: t });
                    }
                }
            }
            yield t.commit();
        }
        catch (err) {
            yield t.rollback();
            console.error(err);
            return err;
        }
    });
}
exports.modifyTournament = modifyTournament;
function getTournamentsInfoForContestant(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response_data = [];
            const contestant_info = yield contestants_1.default.findAll({ where: { user_id: id } });
            for (const c of contestant_info) {
                const info = yield tournament_1.default.findOne({ where: { id: c.tournament_id } });
                const owner = yield user_1.default.findOne({ where: { id: info.owner_id } });
                const logos = yield logo_1.default.findAll({ where: { tournament_id: c.tournament_id } });
                const imgData = [];
                for (const img of logos) {
                    imgData.push({
                        id: img.id,
                        data: img.logo
                    });
                }
                response_data.push({
                    tournament_id: c.tournament_id,
                    tournament_name: info.tournament_name,
                    description: info.description,
                    organizer: `${owner.name} ${owner.lastname}`,
                    datetime: info.datetime,
                    localization_lat: info.localization_lat,
                    localization_lng: info.localization_lng,
                    participants_limit: info.participants_limit,
                    joining_deadline: info.joining_deadline,
                    current_contestants_amount: info.current_contestants_amount,
                    logos: imgData
                });
            }
            return response_data;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    });
}
exports.getTournamentsInfoForContestant = getTournamentsInfoForContestant;
