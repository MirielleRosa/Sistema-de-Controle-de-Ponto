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
        this.getTotalWorkedHours = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params: { userId } }, res) {
            try {
                let totalHours = yield this.turnService.getTotalWorkedHours(userId);
                totalHours = totalHours !== null && totalHours !== void 0 ? totalHours : 0;
                this.handleTotalHoursResponse(res, totalHours);
            }
            catch (error) {
                this.handleError(res, 'Erro ao carregar total de horas trabalhadas', error);
            }
        });
        this.getWorkedHoursHistory = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params: { userId } }, res) {
            try {
                const history = yield this.turnService.getWorkedHoursHistory(userId);
                res.status(200).json(history);
            }
            catch (error) {
                this.handleError(res, 'Erro ao carregar histórico de horas trabalhadas', error);
            }
        });
        // public getTodayWorkedHoursHistory: RequestHandler = async ({ params: { userId } }: Request, res: Response): Promise<void> => {
        //   try {
        //     console.log(`Procurando histórico de horas para o usuário ${userId}`);
        //     const history = await this.turnService.getTodayWorkedHoursHistory(Number(userId));
        //     res.status(200).json(history);
        //   } catch (error) {
        //     this.handleError(res, 'Erro ao carregar histórico de horas trabalhadas', error);
        //   }
        // };
        this.getTurnDetailsByDate = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params: { userId, date } }, res) {
            try {
                const turnDetails = yield this.turnService.getTurnDetailsByDate(userId, date);
                res.status(200).json(turnDetails);
            }
            catch (error) {
                this.handleError(res, 'Erro ao carregar detalhes dos turnos', error);
            }
        });
        this.teste = (_req, res) => {
            res.status(200).json({ message: 'Teste existe' });
        };
        this.getWorkedHoursToday = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const today = yield this.turnService.getWorkedHoursToday(userId);
                res.status(200).json(today);
            }
            catch (error) {
                console.error('Erro ao carregar horas de hoje:', error);
                res.status(500).json({ error: 'Erro ao carregar histórico de horas trabalhadas de hoje.' });
            }
        });
        this.turnService = turnService;
    }
    handleError(res, message, error) {
        console.error(message, error);
        res.status(500).json({ error: message });
    }
    handleTotalHoursResponse(res, totalHours) {
        res.status(200).json({
            totalHours,
            message: totalHours === 0 ? 'Nenhuma hora registrada para este usuário.' : ''
        });
    }
}
exports.TurnController = TurnController;
