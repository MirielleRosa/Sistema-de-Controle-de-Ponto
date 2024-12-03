import { Request, Response, RequestHandler } from 'express';
import { TurnService } from '../services/turnService';

export class TurnController {

  private turnService: TurnService;

  constructor(turnService: TurnService) {
    this.turnService = turnService;
  }

  private handleError(res: Response, message: string, error: any): void {
    console.error(message, error);
    res.status(500).json({ error: message });
  }

  private handleTotalHoursResponse(res: Response, totalHours: number): void {
    res.status(200).json({ 
      totalHours, 
      message: totalHours === 0 ? 'Nenhuma hora registrada para este usuário.' : '' 
    });
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

  public getTotalWorkedHours: RequestHandler = async ({ params: { userId } }: Request, res: Response): Promise<void> => {
    try {
      console.log("userId controller", userId)

      let totalHours = await this.turnService.getTotalWorkedHours(userId);
  
      totalHours = totalHours ?? 0;
  
      res.status(200).json({ totalHours });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao carregar total de horas trabalhadas' });
    }
  };

  public getWorkedHoursHistory: RequestHandler = async ({ params: { userId } }: Request, res: Response): Promise<void> => {
    try {
      const history = await this.turnService.getWorkedHoursHistory(userId);
      res.status(200).json(history);
    } catch (error) {
      this.handleError(res, 'Erro ao carregar histórico de horas trabalhadas', error);
    }
  };

  // public getTodayWorkedHoursHistory: RequestHandler = async ({ params: { userId } }: Request, res: Response): Promise<void> => {
  //   try {
  //     console.log(`Procurando histórico de horas para o usuário ${userId}`);
  //     const history = await this.turnService.getTodayWorkedHoursHistory(Number(userId));
  //     res.status(200).json(history);
  //   } catch (error) {
  //     this.handleError(res, 'Erro ao carregar histórico de horas trabalhadas', error);
  //   }
  // };
  
  public getTurnDetailsByDate: RequestHandler = async ({ params: { userId, date } }: Request, res: Response): Promise<void> => {
    try {
      const turnDetails = await this.turnService.getTurnDetailsByDate(userId, date);
      res.status(200).json(turnDetails);
    } catch (error) {
      this.handleError(res, 'Erro ao carregar detalhes dos turnos', error);
    }
  };

  public teste: RequestHandler = (_req: Request, res: Response): void => {
    res.status(200).json({ message: 'Teste existe' });
  };

  public getWorkedHoursToday: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
  
    try {
      const today = await this.turnService.getWorkedHoursToday(userId);
  
      res.status(200).json(today);
    } catch (error) {
      console.error('Erro ao carregar horas de hoje:', error);
      res.status(500).json({ error: 'Erro ao carregar histórico de horas trabalhadas de hoje.' });
    }
  };
}