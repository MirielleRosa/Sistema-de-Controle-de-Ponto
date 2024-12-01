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
// services/turnService.ts
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
            turn.totalHours = diffInMs / 3600000; // Convertendo milissegundos para horas
            yield turn.save();
            return turn;
        });
    }
    getTotalWorkedHours(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pegando o início e fim do dia atual
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Início do dia
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Final do dia
            // Encontrando os turnos do dia atual
            const turns = yield turn_1.default.findAll({
                where: {
                    userId,
                    startTime: { [sequelize_1.Op.gte]: startOfDay },
                    endTime: { [sequelize_1.Op.lte]: endOfDay }
                }
            });
            // Se não encontrar turnos, retorna 0
            if (!turns.length) {
                return 0; // Retorna 0 se não houver turnos
            }
            const totalHours = turns.reduce((acc, turn) => {
                if (turn.endTime) {
                    const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
                    return acc + diffInMs;
                }
                return acc;
            }, 0);
            return totalHours / 3600000; // Convertendo milissegundos para horas
        });
    }
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
                const dateKey = turn.startTime.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                const existingEntry = acc.find(entry => entry.date === dateKey);
                const diffInMs = turn.endTime ? turn.endTime.getTime() - turn.startTime.getTime() : 0;
                const totalSeconds = diffInMs / 1000; // Convertendo milissegundos para segundos
                // Calculando horas, minutos e segundos
                const totalHours = Math.floor(totalSeconds / 3600);
                const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
                const totalSecondsFormatted = Math.floor(totalSeconds % 60);
                // Formatando para HH:MM:SS
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
    // Função auxiliar para somar tempos no formato HH:MM:SS
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
}
exports.TurnService = TurnService;
