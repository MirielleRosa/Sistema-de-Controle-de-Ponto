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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app")); // Substitua pelo caminho correto para o seu app.
const turnService_1 = require("../src/services/turnService");
// Mock do TurnService
jest.mock('../src/services/turnService');
const mockTurnService = turnService_1.TurnService;
describe('TurnController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // it('POST /start - deve iniciar um turno com sucesso', async () => {
    //   const startTurnResponse = {
    //     id: 1,
    //     userId: 7,
    //     startTime: new Date('2024-12-01T08:00:00.000Z'),
    //     endTime: null,
    //     totalHours: null,
    //   };
    //   mockTurnService.prototype.startTurn.mockResolvedValueOnce(startTurnResponse);
    //   const response = await request(app).post('/api/start').send({ userId: 7 });
    //   expect(response.status).toBe(201);
    //   expect(response.body).toEqual({
    //     id: 1,
    //     userId: 7,
    //     startTime: '2024-12-01T08:00:00.000Z',
    //     endTime: null,
    //     totalHours: null,
    //   });
    //   expect(mockTurnService.prototype.startTurn).toHaveBeenCalledWith(7);
    // });
    // it('POST /end/:turnId - deve finalizar um turno com sucesso', async () => {
    //   const endTurnResponse = {
    //     id: 1,
    //     userId: 7,
    //     startTime: new Date('2024-12-01T08:00:00.000Z'),
    //     endTime: new Date('2024-12-01T17:00:00.000Z'),
    //     totalHours: 9,
    //   };
    //   mockTurnService.prototype.endTurn.mockResolvedValueOnce(endTurnResponse);
    //   const response = await request(app).post('/api/end/1').send();
    //   expect(response.status).toBe(200);
    //   expect(response.body).toEqual({
    //     id: 1,
    //     userId: 7,
    //     startTime: '2024-12-01T08:00:00.000Z',
    //     endTime: '2024-12-01T17:00:00.000Z',
    //     totalHours: 9,
    //   });
    //   expect(mockTurnService.prototype.endTurn).toHaveBeenCalledWith(1);
    // });
    it('GET /total/:userId - deve retornar o total de horas trabalhadas', () => __awaiter(void 0, void 0, void 0, function* () {
        mockTurnService.prototype.getTotalWorkedHours.mockResolvedValueOnce(8);
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/total/7');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ totalHours: 8, message: '' });
        expect(mockTurnService.prototype.getTotalWorkedHours).toHaveBeenCalledWith(7);
    }));
    it('GET /history/:userId - deve retornar o histórico de horas trabalhadas', () => __awaiter(void 0, void 0, void 0, function* () {
        const history = [
            { date: '2024-12-01', totalTime: '09:00:00' },
        ];
        mockTurnService.prototype.getWorkedHoursHistory.mockResolvedValueOnce(history);
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/history/7');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(history);
        expect(mockTurnService.prototype.getWorkedHoursHistory).toHaveBeenCalledWith(7);
    }));
    it('GET /turn-details/:userId/:date - deve retornar detalhes do turno por data', () => __awaiter(void 0, void 0, void 0, function* () {
        const turnDetails = [
            {
                startTime: '08:00',
                endTime: '17:00',
                totalTime: '09:00',
            },
        ];
        mockTurnService.prototype.getTurnDetailsByDate.mockResolvedValueOnce(turnDetails);
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/turn-details/7/2024-12-01');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(turnDetails);
        expect(mockTurnService.prototype.getTurnDetailsByDate).toHaveBeenCalledWith(7, '2024-12-01');
    }));
    it('POST /start - deve retornar erro ao iniciar turno', () => __awaiter(void 0, void 0, void 0, function* () {
        mockTurnService.prototype.startTurn.mockRejectedValueOnce(new Error('Erro ao iniciar o turno'));
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/start').send({ userId: 7 });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Erro ao iniciar o turno' });
    }));
    it('POST /end/:turnId - deve retornar erro ao finalizar turno inexistente', () => __awaiter(void 0, void 0, void 0, function* () {
        mockTurnService.prototype.endTurn.mockRejectedValueOnce(new Error('Turno não encontrado'));
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/end/999').send();
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Erro ao finalizar turno' });
    }));
    it('GET /total/:userId - deve retornar mensagem quando não houver horas registradas', () => __awaiter(void 0, void 0, void 0, function* () {
        mockTurnService.prototype.getTotalWorkedHours.mockResolvedValueOnce(0);
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/total/7');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ totalHours: 0, message: 'Nenhuma hora registrada para este usuário.' });
    }));
});
