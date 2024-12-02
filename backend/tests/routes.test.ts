import request from 'supertest';
import express from 'express';
import turnRoutes from '../src/routes/turn';

const app = express();
app.use(express.json());
app.use(turnRoutes);

describe('Turn Routes', () => {
  it('should call startTurn endpoint', async () => {
    const response = await request(app).post('/start').send({ userId: 1 });
    expect(response.status).toBe(201);
  });

  it('should call endTurn endpoint', async () => {
    const response = await request(app).post('/end/1');
    expect(response.status).toBe(200);
  });

  it('should call getTotalWorkedHours endpoint', async () => {
    const response = await request(app).get('/total/1');
    expect(response.status).toBe(200);
  });

  it('should call getWorkedHoursHistory endpoint', async () => {
    const response = await request(app).get('/history/1');
    expect(response.status).toBe(200);
  });
});
