import request from 'supertest';
import app  from '../src/app'; // Substitua pelo caminho correto para o seu app.
import { TurnService } from '../src/services/turnService';

// Mock do TurnService
jest.mock('../src/services/turnService');
const mockTurnService = TurnService as jest.MockedClass<typeof TurnService>;

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

  it('GET /total/:userId - deve retornar o total de horas trabalhadas', async () => {
    mockTurnService.prototype.getTotalWorkedHours.mockResolvedValueOnce(8);

    const response = await request(app).get('/api/total/7');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalHours: 8, message: '' });
    expect(mockTurnService.prototype.getTotalWorkedHours).toHaveBeenCalledWith(7);
  });

  it('GET /history/:userId - deve retornar o histórico de horas trabalhadas', async () => {
    const history = [
      { date: '2024-12-01', totalTime: '09:00:00' },
    ];
    mockTurnService.prototype.getWorkedHoursHistory.mockResolvedValueOnce(history);

    const response = await request(app).get('/api/history/7');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(history);
    expect(mockTurnService.prototype.getWorkedHoursHistory).toHaveBeenCalledWith(7);
  });

  it('GET /turn-details/:userId/:date - deve retornar detalhes do turno por data', async () => {
    const turnDetails = [
      {
        startTime: '08:00',
        endTime: '17:00',
        totalTime: '09:00',
      },
    ];
    mockTurnService.prototype.getTurnDetailsByDate.mockResolvedValueOnce(turnDetails);

    const response = await request(app).get('/api/turn-details/7/2024-12-01');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(turnDetails);
    expect(mockTurnService.prototype.getTurnDetailsByDate).toHaveBeenCalledWith(7, '2024-12-01');
  });

  it('POST /start - deve retornar erro ao iniciar turno', async () => {
    mockTurnService.prototype.startTurn.mockRejectedValueOnce(new Error('Erro ao iniciar o turno'));

    const response = await request(app).post('/api/start').send({ userId: 7 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao iniciar o turno' });
  });

  it('POST /end/:turnId - deve retornar erro ao finalizar turno inexistente', async () => {
    mockTurnService.prototype.endTurn.mockRejectedValueOnce(new Error('Turno não encontrado'));

    const response = await request(app).post('/api/end/999').send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao finalizar turno' });
  });

  it('GET /total/:userId - deve retornar mensagem quando não houver horas registradas', async () => {
    mockTurnService.prototype.getTotalWorkedHours.mockResolvedValueOnce(0);

    const response = await request(app).get('/api/total/7');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalHours: 0, message: 'Nenhuma hora registrada para este usuário.' });
  });
});
