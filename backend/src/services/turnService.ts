import { Op } from 'sequelize';
import Turn from '../models/turn';

export class TurnService {
  public async startTurn(userId: number) {
    const turn = await Turn.create({
      userId,
      startTime: new Date(),
      endTime: null,
      totalHours: null
    });

    return turn;
  }

  public async endTurn(turnId: number) {
    const turn = await Turn.findByPk(turnId);
    if (!turn) {
      throw new Error('Turno não encontrado');
    }

    if (turn.endTime) {
      throw new Error('Turno já finalizado');
    }

    turn.endTime = new Date();
    const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
    turn.totalHours = diffInMs / 3600000;
    await turn.save();

    return turn;
  }

  public async getTotalWorkedHours(userId: number) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const turns = await Turn.findAll({
      where: {
        userId,
        startTime: { [Op.gte]: startOfDay },
        endTime: { [Op.lte]: endOfDay }
      }
    });

    if (!turns.length) {
      return 0;
    }

    const totalHours = turns.reduce((acc, turn) => {
      if (turn.endTime) {
        const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
        return acc + diffInMs;
      }
      return acc;
    }, 0);

    return totalHours / 3600000;
  }

  public async getWorkedHoursHistory(userId: number) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    const turns = await Turn.findAll({
      where: {
        userId,
        endTime: { [Op.lt]: startOfDay }
      }
    });

    if (!turns.length) {
      return [];
    }

    const history = turns.reduce((acc: any[], turn) => {
      const dateKey = turn.startTime.toISOString().split('T')[0];
      const existingEntry = acc.find(entry => entry.date === dateKey);

      const diffInMs = turn.endTime ? turn.endTime.getTime() - turn.startTime.getTime() : 0;
      const totalSeconds = diffInMs / 1000;

      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
      const totalSecondsFormatted = Math.floor(totalSeconds % 60);

      const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSecondsFormatted).padStart(2, '0')}`;

      if (existingEntry) {
        existingEntry.totalTime = this.addTime(existingEntry.totalTime, formattedTime);
      } else {
        acc.push({
          date: dateKey,
          totalTime: formattedTime
        });
      }

      return acc;
    }, []);

    return history;
  }

  private addTime(existingTime: string, newTime: string): string {
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