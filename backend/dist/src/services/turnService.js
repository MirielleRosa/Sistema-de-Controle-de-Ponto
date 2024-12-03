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
exports.TurnService = void 0;
const turn_1 = __importDefault(require("../models/turn"));
const sequelize_1 = require("sequelize");
class TurnService {
    calculateTimeDiff(startTime, endTime) {
        return (endTime.getTime() - startTime.getTime()) / 3600000; // Retorna em horas
    }
    startTurn(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const turn = yield turn_1.default.create({
                userId,
                startTime: new Date(),
                endTime: null,
                totalHours: null
            });
            return turn;
        });
    }
    endTurn(turnId) {
        return __awaiter(this, void 0, void 0, function* () {
            const turn = yield turn_1.default.findByPk(turnId);
            if (!turn) {
                throw new Error('Turno não encontrado');
            }
            if (turn.endTime) {
                throw new Error('Turno já finalizado');
            }
            turn.endTime = new Date();
            const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
            turn.totalHours = diffInMs / 3600000;
            yield turn.save();
            return turn;
        });
    }
    getTotalWorkedHours(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const userTurns = yield turn_1.default.findAll({
                where: {
                    userId,
                    endTime: { [sequelize_1.Op.ne]: null },
                    startTime: { [sequelize_1.Op.gte]: today },
                },
            });
            console.log(userTurns);
            const totalMilliseconds = userTurns.reduce((acc, turn) => {
                const diffInMs = this.calculateTimeDiff(turn.startTime, turn.endTime);
                return acc + diffInMs;
            }, 0);
            return totalMilliseconds;
        });
    }
    getWorkedHoursHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const history = {};
            const userTurns = yield turn_1.default.findAll({
                where: { userId, endTime: { [sequelize_1.Op.ne]: null } },
            });
            userTurns.forEach((turn) => {
                const dateKey = turn.startTime.toISOString().split('T')[0];
                const diffInMs = this.calculateTimeDiff(turn.startTime, turn.endTime);
                history[dateKey] = (history[dateKey] || 0) + diffInMs;
            });
            const result = Object.entries(history).map(([date, totalMs]) => {
                const totalSeconds = totalMs * 3600;
                const totalHours = Math.floor(totalSeconds / 3600);
                const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
                if (totalHours > 0) {
                    const totalTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`;
                    return { date, totalTime };
                }
                return null;
            }).filter(item => item !== null);
            return result;
        });
    }
    getTurnDetailsByDate(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay.setHours(23, 59, 59, 999);
            const turns = yield turn_1.default.findAll({
                where: {
                    userId,
                    startTime: { [sequelize_1.Op.gte]: startOfDay },
                    endTime: { [sequelize_1.Op.lte]: endOfDay },
                },
            });
            return turns.map((turn) => {
                // Converter startTime para o fuso horário local (UTC-3)
                const adjustedStartTime = new Date(turn.startTime);
                adjustedStartTime.setHours(adjustedStartTime.getHours() - 3); // Subtrair 3 horas
                const startTime = adjustedStartTime.toISOString().substring(11, 16);
                // Converter endTime para o fuso horário local (UTC-3) se houver
                const adjustedEndTime = turn.endTime ? new Date(turn.endTime) : null;
                const endTime = adjustedEndTime
                    ? (adjustedEndTime.setHours(adjustedEndTime.getHours() - 3), adjustedEndTime.toISOString().substring(11, 16))
                    : 'N/A';
                const diffInMs = turn.endTime ? this.calculateTimeDiff(turn.startTime, turn.endTime) : 0;
                const totalSeconds = diffInMs * 3600;
                const totalHours = Math.floor(totalSeconds / 3600);
                const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
                const totalTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`;
                return { startTime, endTime, totalTime };
            });
        });
    }
    getWorkedHoursToday(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            const offset = 3 * 60;
            const startOfDayLocal = new Date(startOfDay.getTime() - (startOfDay.getTimezoneOffset() * 60000) + (offset * 60000));
            const endOfDayLocal = new Date(endOfDay.getTime() - (endOfDay.getTimezoneOffset() * 60000) + (offset * 60000));
            const turns = yield turn_1.default.findAll({
                where: {
                    userId,
                    startTime: { [sequelize_1.Op.gte]: startOfDayLocal },
                    [sequelize_1.Op.or]: [
                        { endTime: { [sequelize_1.Op.lte]: endOfDayLocal } },
                        { endTime: null }
                    ]
                }
            });
            if (!turns.length) {
                return [];
            }
            return turns.map(turn => {
                const startTime = turn.startTime;
                let endTime = turn.endTime;
                return {
                    startDate: startTime,
                    startTime: startTime,
                    endDate: endTime,
                    endTime: endTime
                };
            });
        });
    }
}
exports.TurnService = TurnService;
