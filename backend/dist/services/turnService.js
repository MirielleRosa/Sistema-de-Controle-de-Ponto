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
exports.calculateTotalWorkedHours = void 0;
const turn_1 = __importDefault(require("../models/turn"));
const calculateTotalWorkedHours = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const turns = yield turn_1.default.findAll({ where: { userId } });
    if (!turns.length)
        throw new Error('Nenhum turno encontrado para este usuário');
    const totalHours = turns.reduce((acc, turn) => {
        if (turn.endTime) {
            const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
            return acc + diffInMs;
        }
        return acc;
    }, 0);
    return totalHours / 3600000;
});
exports.calculateTotalWorkedHours = calculateTotalWorkedHours;
