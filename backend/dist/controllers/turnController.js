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
exports.getTotalWorkedHours = exports.endTurn = exports.startTurn = void 0;
const turnService_1 = require("../services/turnService");
const turn_1 = __importDefault(require("../models/turn"));
const startTurn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'userId é obrigatório' });
            return;
        }
        const turn = yield turn_1.default.create({
            userId,
            startTime: new Date(),
            endTime: null
        });
        res.status(201).json(turn);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao iniciar o turno' });
    }
});
exports.startTurn = startTurn;
const endTurn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { turnId } = req.params;
        const id = parseInt(turnId, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID do turno inválido' });
            return;
        }
        const turn = yield turn_1.default.findByPk(id);
        if (!turn) {
            res.status(404).json({ error: 'Turno não encontrado' });
            return;
        }
        if (!(turn.startTime instanceof Date)) {
            res.status(500).json({ error: 'startTime inválido' });
            return;
        }
        turn.endTime = new Date();
        const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
        turn.totalHours = diffInMs / 3600000;
        yield turn.save();
        res.status(200).json(turn);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao finalizar o turno' });
    }
});
exports.endTurn = endTurn;
const getTotalWorkedHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ error: 'userId é obrigatório' });
            return;
        }
        const turns = yield turn_1.default.findAll({ where: { userId } });
        if (!turns.length) {
            res.status(404).json({ error: 'Nenhum turno encontrado para este usuário' });
            return;
        }
        const totalHours = yield (0, turnService_1.calculateTotalWorkedHours)(parseInt(userId, 10));
        res.json({ totalHours });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao calcular total de horas' });
    }
});
exports.getTotalWorkedHours = getTotalWorkedHours;
exports.default = {
    startTurn: exports.startTurn,
    endTurn: exports.endTurn,
    getTotalWorkedHours: exports.getTotalWorkedHours
};
