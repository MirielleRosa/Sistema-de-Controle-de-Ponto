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
const sequelize_1 = require("sequelize");
const turn_1 = __importDefault(require("../models/turn"));
class TurnService {
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
            const timeZone = 'America/Sao_Paulo'; // Fuso horário de Brasília
            // Obtém a data e hora de Brasília
            const today = new Date();
            const zonedToday = (0, date_fns_tz_1.toZonedTime)(today, timeZone); // Converte para o fuso horário de São Paulo (Brasil)
            // Cria novos objetos para o início e fim do dia no fuso horário de Brasília
            const startOfDay = new Date(zonedToday.getFullYear(), zonedToday.getMonth(), zonedToday.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(zonedToday.getFullYear(), zonedToday.getMonth(), zonedToday.getDate(), 23, 59, 59, 999);
            // Buscar turnos dentro do intervalo do dia atual em UTC
            const turns = yield turn_1.default.findAll({
                where: {
                    userId,
                    startTime: { [sequelize_1.Op.gte]: startOfDay }, // Filtro pelo início do dia
                    endTime: { [sequelize_1.Op.lte]: endOfDay } // Filtro pelo fim do dia
                }
            });
            // Se não houver turnos registrados, retorna 0
            if (!turns.length) {
                return 0;
            }
            console.log("turns.length", turns.length);
            // Somar o total de horas
            const totalMilliseconds = turns.reduce((acc, turn) => {
                if (turn.endTime && turn.startTime) {
                    const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
                    // Se a diferença for negativa (erro de horário), ignora o turno
                    if (diffInMs < 0)
                        return acc;
                    return acc + diffInMs;
                }
                return acc;
            }, 0);
            // Converte de milissegundos para horas
            const totalHours = totalMilliseconds / 3600000;
            // Retorna o total de horas, se for maior que 0
            return totalHours > 0 ? totalHours : 0;
        });
    }
    /////////////////////
    getWorkedHoursHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const turns = yield turn_1.default.findAll({
                where: {
                    userId,
                    endTime: { [sequelize_1.Op.lt]: startOfDay }
                }
            });
            if (!turns.length) {
                return [];
            }
            const history = turns.reduce((acc, turn) => {
                const dateKey = turn.startTime.toISOString().split('T')[0];
                const existingEntry = acc.find(entry => entry.date === dateKey);
                const diffInMs = turn.endTime ? turn.endTime.getTime() - turn.startTime.getTime() : 0;
                const totalSeconds = diffInMs / 1000;
                const totalHours = Math.floor(totalSeconds / 3600);
                const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
                const totalSecondsFormatted = Math.floor(totalSeconds % 60);
                const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSecondsFormatted).padStart(2, '0')}`;
                if (existingEntry) {
                    existingEntry.totalTime = this.addTime(existingEntry.totalTime, formattedTime);
                }
                else {
                    acc.push({
                        date: dateKey,
                        totalTime: formattedTime
                    });
                }
                return acc;
            }, []);
            return history;
        });
    }
    addTime(existingTime, newTime) {
        const [existingHours, existingMinutes, existingSeconds] = existingTime.split(':').map(Number);
        const [newHours, newMinutes, newSeconds] = newTime.split(':').map(Number);
        let totalSeconds = existingSeconds + newSeconds;
        let totalMinutes = existingMinutes + newMinutes + Math.floor(totalSeconds / 60);
        let totalHours = existingHours + newHours + Math.floor(totalMinutes / 60);
        totalSeconds %= 60;
        totalMinutes %= 60;
        totalHours %= 24;
        return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    }
    getTurnDetailsByDate(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('UserID:', userId, 'Date:', date);
            const startOfDay = new Date(date.replace(/-/g, '/'));
            const endOfDay = new Date(date.replace(/-/g, '/'));
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay.setHours(23, 59, 59, 999);
            const turns = yield turn_1.default.findAll({
                where: {
                    userId,
                    startTime: { [sequelize_1.Op.gte]: startOfDay },
                    endTime: { [sequelize_1.Op.lte]: endOfDay }
                }
            });
            const formattedTurns = turns.map((turn) => {
                const startTime = turn.startTime.toISOString().substring(11, 16);
                const endTime = turn.endTime ? turn.endTime.toISOString().substring(11, 16) : 'N/A';
                const diffInMs = turn.endTime ? turn.endTime.getTime() - turn.startTime.getTime() : 0;
                const totalSeconds = diffInMs / 1000;
                const totalHours = Math.floor(totalSeconds / 3600);
                const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
                const totalTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`;
                return {
                    startTime,
                    endTime,
                    totalTime
                };
            });
            return formattedTurns;
        });
    }
}
exports.TurnService = TurnService;
