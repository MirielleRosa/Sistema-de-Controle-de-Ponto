import { Request, Response, RequestHandler } from 'express';
import { TurnService } from '../services/turnService';

export class TurnController {
  private turnService: TurnService;

  constructor(turnService: TurnService) {
    this.turnService = turnService;
  }

  public startTurn: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    try {
      const turn = await this.turnService.startTurn(userId);
      res.status(201).json(turn);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao iniciar o turno' });
    }
  };

  public endTurn: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { turnId } = req.params;

    try {
      const updatedTurn = await this.turnService.endTurn(Number(turnId));
      res.status(200).json(updatedTurn);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  public getTotalWorkedHours: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      let totalHours = await this.turnService.getTotalWorkedHours(Number(userId));

      if (totalHours === null || totalHours === undefined) {
        totalHours = 0;
      }

      res.status(200).json({ totalHours, message: totalHours === 0 ? 'Nenhuma hora registrada para este usuário.' : '' });
    } catch (error) {
      console.error('Erro ao carregar total de horas:', error);
      res.status(500).json({ error: 'Erro ao carregar total de horas trabalhadas.' });
    }
  };

  public getWorkedHoursHistory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      const history = await this.turnService.getWorkedHoursHistory(Number(userId));

      res.status(200).json(history);
    } catch (error) {
      console.error('Erro ao carregar histórico de horas:', error);
      res.status(500).json({ error: 'Erro ao carregar histórico de horas trabalhadas.' });
    }
  };

  public getTurnDetailsByDate: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId, date } = req.params;

    try {
      const turnDetails = await this.turnService.getTurnDetailsByDate(Number(userId), date);
      res.status(200).json(turnDetails);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao carregar detalhes dos turnos.' });
    }
  };
}