"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
class JobsStorage {
    constructor() {
        this.jobs = [];
    }
    setJob(tournament_id, job) {
        this.jobs[tournament_id] = job;
    }
    reschedule(tournament_id, date) {
        this.jobs[tournament_id] = node_schedule_1.default.rescheduleJob(this.jobs[tournament_id], date);
    }
}
exports.default = new JobsStorage();
