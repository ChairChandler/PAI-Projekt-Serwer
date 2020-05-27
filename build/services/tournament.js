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
const logo_1 = __importDefault(require("models/logo"));
const database_1 = __importDefault(require("static/database"));
function getTournamentList(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tournaments;
            if (body.amount) {
                tournaments = yield tournament_1.default.findAll({ limit: body.amount });
            }
            else {
                tournaments = yield tournament_1.default.findAll();
            }
            return tournaments.map(v => Object({ "id": v.id, "name": v.tournament_name }));
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
exports.getTournamentList = getTournamentList;
function getTournamentInfo(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield tournament_1.default.findOne({ where: { id: body.id } });
            const owner = yield user_1.default.findOne({ where: { id: info.owner_id } });
            const logos = yield logo_1.default.findAll({ where: { tournament_id: body.id } });
            const imgData = [];
            for (let img of logos) {
                imgData.push({
                    id: img.id,
                    data: new Uint8ClampedArray(yield img.logo.arrayBuffer())
                });
            }
            return {
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
            return null;
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
            });
            for (const logo of body.logos) {
                yield logo_1.default.create({
                    tournament_id: tournament.id,
                    logo: logo
                });
            }
            yield t.commit();
            return true;
        }
        catch (err) {
            yield t.rollback();
            console.error(err);
            return false;
        }
    });
}
exports.createTournament = createTournament;
function modifyTournament(body, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield database_1.default.transaction();
        try {
            const update_body = {};
            if ('tournament_name' in body) {
                update_body['tournament_name'] = body.tournament_name;
            }
            if ('description' in body) {
                update_body['description'] = body.description;
            }
            if ('datetime' in body) {
                update_body['datetime'] = body.datetime;
            }
            if ('localization_lat' in body) {
                update_body['localization_lat'] = body.localization_lat;
            }
            if ('localization_lng' in body) {
                update_body['localization_lng'] = body.localization_lng;
            }
            if ('participants_limit' in body) {
                update_body['participants_limit'] = body.participants_limit;
            }
            if ('joining_deadline' in body) {
                update_body['joining_deadline'] = body.joining_deadline;
            }
            const tournament = yield tournament_1.default.findOne({ where: { id: body.tournament_id } });
            if (tournament.owner_id != id) {
                throw Error('unauthorized access to modify protected data');
            }
            yield tournament.update(update_body);
            if ('logos' in body) {
                for (const l of body.logos) {
                    if (l.id) {
                        yield logo_1.default.update({ logo: l.data }, { where: { id: l.id } });
                    }
                    else {
                        yield logo_1.default.create({ tournament_id: body.tournament_id, logo: l.data });
                    }
                }
            }
            yield t.commit();
            return true;
        }
        catch (err) {
            yield t.rollback();
            console.error(err);
            return false;
        }
    });
}
exports.modifyTournament = modifyTournament;