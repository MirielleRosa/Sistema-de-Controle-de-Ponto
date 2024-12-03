import Turn from '../models/turn'; 
import { Op, Sequelize } from 'sequelize';
import { Turn as TurnInterface } from '../interfaces/Turn';

export class TurnService {
  private calculateTimeDiff(startTime: Date, endTime: Date): number {
    return (endTime.getTime() - startTime.getTime()) / 3600000; // Retorna em horas
  }

  public async startTurn(userId: string) {
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

  async getTotalWorkedHours(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("user id service", userId)

    const userTurns = await Turn.findAll({
      where: {
        userId: userId.toString(), 
        endTime: { [Op.ne]: null },
        startTime: { [Op.gte]: today },
      },
    });

    console.log(userTurns)

    const totalMilliseconds = userTurns.reduce((acc, turn) => {
      const diffInMs = this.calculateTimeDiff(turn.startTime, turn.endTime!);
      return acc + diffInMs;
    }, 0);

    return totalMilliseconds;
  }
  
  async getWorkedHoursHistory(userId: string): Promise<{ date: string; totalTime: string }[]> {
    const history: { [date: string]: number } = {};
  
    const userTurns = await Turn.findAll({
      where: { userId, endTime: { [Op.ne]: null } },
    });
  
    userTurns.forEach((turn) => {
      const dateKey = turn.startTime.toISOString().split('T')[0]; 
      const diffInMs = this.calculateTimeDiff(turn.startTime, turn.endTime!);
      history[dateKey] = (history[dateKey] || 0) + diffInMs;
    });
  
    const result = Object.entries(history).map(([date, totalMs]) => {
      const totalSeconds = totalMs * 3600;
      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  
      if (totalHours > 0) {
        const totalTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`;
        return { date, totalTime };
      }
  
      return null;
    }).filter(item => item !== null);
  
    return result as { date: string; totalTime: string }[];
  }
  
  async getTurnDetailsByDate(userId: string, date: string): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    
    const turns = await Turn.findAll({
      where: {
        userId: userId,
        startTime: { [Op.gte]: startOfDay },
        endTime: { [Op.lte]: endOfDay },
      },
    });

    console.log(turns)

    return turns.map((turn) => {
      const adjustedStartTime = new Date(turn.startTime);
      adjustedStartTime.setHours(adjustedStartTime.getHours() - 3);
      const startTime = adjustedStartTime.toISOString().substring(11, 16);

      const adjustedEndTime = turn.endTime ? new Date(turn.endTime) : null;
      const endTime = adjustedEndTime
        ? (adjustedEndTime.setHours(adjustedEndTime.getHours() - 3), adjustedEndTime.toISOString().substring(11, 16))
        : 'N/A';

      const diffInMs = turn.endTime ? this.calculateTimeDiff(turn.startTime, turn.endTime) : 0;
      const totalSeconds = diffInMs * 3600;
      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
      const totalTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`;

      return { startTime, endTime, totalTime };
    });
  }

  public async getWorkedHoursToday(userId: string) {
    const today = new Date();
    
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
  
    const offset = 3 * 60; 
    const startOfDayLocal = new Date(startOfDay.getTime() - (startOfDay.getTimezoneOffset() * 60000) + (offset * 60000));
    const endOfDayLocal = new Date(endOfDay.getTime() - (endOfDay.getTimezoneOffset() * 60000) + (offset * 60000));
    
    const turns = await Turn.findAll({
      where: {
        userId,
        startTime: { [Op.gte]: startOfDayLocal },
        [Op.or]: [
          { endTime: { [Op.lte]: endOfDayLocal } },  
          { endTime: null }                         
        ]
      }
    });
      
    if (!turns.length) {
      return [];
    }
  
    return turns.map(turn => {
      const startTime = turn.startTime; 
      let endTime = turn.endTime;       

      return {
        startDate: startTime,  
        startTime: startTime,  
        endDate: endTime,     
        endTime: endTime      
      };
    });
  }

}
