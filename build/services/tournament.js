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
            return { "tournaments": tournaments.map(v => Object({ "id": v.id, "name": v.tournament_name })) };
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
            const logos = yield logo_1.default.findAll({
                include: [tournament_1.default],
                where: { '$Tournament.id$': info.id }
            });
            const imgData = [];
            for (let img of logos) {
                imgData.push(new Uint8ClampedArray(yield img.logo.arrayBuffer()));
            }
            return {
                name: info.tournament_name,
                description: info.description,
                organizer: `${owner.name} ${owner.lastname}`,
                time: info.datetime,
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
