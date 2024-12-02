import request from 'supertest';
import express from 'express';
import { TurnController } from '../src/controllers/turnController';
import { TurnService } from '../src/services/turnService';

jest.mock('../src/services/turnService');

const app = express();
app.use(express.json());

const turnService = new TurnService();
const turnController = new TurnController(turnService);

app.post('/start', turnController.startTurn);
app.post('/end/:turnId', turnController.endTurn);
app.get('/total/:userId', turnController.getTotalWorkedHours);
app.get('/history/:userId', turnController.getWorkedHoursHistory);

describe('TurnController', () => {
  it('should start a turn', async () => {
    const userId = 1;
    TurnService.prototype.startTurn = jest.fn().mockResolvedValue({ userId, startTime: new Date() });

    const response = await request(app).post('/start').send({ userId });

    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(userId);
  });

  it('should end a turn', async () => {
    const turnId = 1;
    TurnService.prototype.endTurn = jest.fn().mockResolvedValue({ turnId, endTime: new Date(), totalHours: 8 });

    const response = await request(app).post(`/end/${turnId}`);

    expect(response.status).toBe(200);
    expect(response.body.totalHours).toBe(8);
  });

  it('should return total worked hours', async () => {
    const userId = 1;
    TurnService.prototype.getTotalWorkedHours = jest.fn().mockResolvedValue(8);

    const response = await request(app).get(`/total/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.totalHours).toBe(8);
  });

  it('should return worked hours history', async () => {
    const userId = 1;
    TurnService.prototype.getWorkedHoursHistory = jest.fn().mockResolvedValue([{ date: '2024-12-01', totalTime: '08:00:00' }]);

    const response = await request(app).get(`/history/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ date: '2024-12-01', totalTime: '08:00:00' }]);
  });
});
