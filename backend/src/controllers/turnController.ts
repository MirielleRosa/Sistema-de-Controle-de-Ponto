import { Request, Response } from 'express';
import { calculateTotalWorkedHours } from '../services/turnService';
import Turn from '../models/turn';

export const startTurn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId é obrigatório' });
      return;
    }

    const turn = await Turn.create({ 
      userId, 
      startTime: new Date(), 
      endTime: null 
    });

    res.status(201).json(turn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao iniciar o turno' });
  }
};

export const endTurn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { turnId } = req.params;

    const id = parseInt(turnId, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID do turno inválido' });
      return;
    }

    const turn = await Turn.findByPk(id);

    if (!turn) {
      res.status(404).json({ error: 'Turno não encontrado' });
      return;
    }

    if (!(turn.startTime instanceof Date)) {
      res.status(500).json({ error: 'startTime inválido' });
      return;
    }

    turn.endTime = new Date();

    const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
    turn.totalHours = diffInMs / 3600000;  

    await turn.save();
    res.status(200).json(turn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao finalizar o turno' });
  }
};

export const getTotalWorkedHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: 'userId é obrigatório' });
      return;
    }

    const turns = await Turn.findAll({ where: { userId } });

    if (!turns.length) {
      res.status(404).json({ error: 'Nenhum turno encontrado para este usuário' });
      return;
    }

    const totalHours = await calculateTotalWorkedHours(parseInt(userId, 10));
    res.json({ totalHours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao calcular total de horas' });
  }
};

export default {
  startTurn,
  endTurn,
  getTotalWorkedHours
};
