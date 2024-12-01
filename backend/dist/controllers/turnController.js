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
// Definindo a classe TurnController
class TurnController {
    constructor(turnService) {
        // Tipando corretamente os métodos como RequestHandler
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
                // Se totalHours for null ou undefined, trata isso como 0 horas
                if (totalHours === null || totalHours === undefined) {
                    totalHours = 0;
                }
                // Retorna o totalHours com uma mensagem explicativa se for 0
                res.status(200).json({ totalHours, message: totalHours === 0 ? 'Nenhuma hora registrada para este usuário.' : '' });
            }
            catch (error) {
                console.error('Erro ao carregar total de horas:', error); // Adicionando log detalhado do erro
                res.status(500).json({ error: 'Erro ao carregar total de horas trabalhadas.' });
            }
        });
        // Método para buscar o histórico de horas trabalhadas
        this.getWorkedHoursHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const history = yield this.turnService.getWorkedHoursHistory(Number(userId));
                // Retorna o histórico das horas trabalhadas por data
                res.status(200).json(history);
            }
            catch (error) {
                console.error('Erro ao carregar histórico de horas:', error); // Log de erro
                res.status(500).json({ error: 'Erro ao carregar histórico de horas trabalhadas.' });
            }
        });
        this.turnService = turnService;
    }
}
exports.TurnController = TurnController;
