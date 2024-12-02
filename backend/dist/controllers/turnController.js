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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnController = void 0;
class TurnController {
    constructor(turnService) {
        this.startTurn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body;
            try {
                const turn = yield this.turnService.startTurn(userId);
                res.status(201).json(turn);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao iniciar o turno' });
            }
        });
        this.endTurn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { turnId } = req.params;
            try {
                const updatedTurn = yield this.turnService.endTurn(Number(turnId));
                res.status(200).json(updatedTurn);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
        this.getTotalWorkedHours = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                let totalHours = yield this.turnService.getTotalWorkedHours(Number(userId));
                if (totalHours === null || totalHours === undefined) {
                    totalHours = 0;
                }
                res.status(200).json({ totalHours, message: totalHours === 0 ? 'Nenhuma hora registrada para este usuário.' : '' });
            }
            catch (error) {
                console.error('Erro ao carregar total de horas:', error);
                res.status(500).json({ error: 'Erro ao carregar total de horas trabalhadas.' });
            }
        });
        this.getWorkedHoursHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const history = yield this.turnService.getWorkedHoursHistory(Number(userId));
                res.status(200).json(history);
            }
            catch (error) {
                console.error('Erro ao carregar histórico de horas:', error);
                res.status(500).json({ error: 'Erro ao carregar histórico de horas trabalhadas.' });
            }
        });
        this.getTurnDetailsByDate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, date } = req.params;
            try {
                const turnDetails = yield this.turnService.getTurnDetailsByDate(Number(userId), date);
                res.status(200).json(turnDetails);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao carregar detalhes dos turnos.' });
            }
        });
        this.turnService = turnService;
    }
}
exports.TurnController = TurnController;
