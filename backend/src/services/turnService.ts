import Turn from '../models/turn';

export const calculateTotalWorkedHours = async (userId: number): Promise<number> => {
  const turns = await Turn.findAll({ where: { userId } });

  if (!turns.length) throw new Error('Nenhum turno encontrado para este usuário');

  const totalHours = turns.reduce((acc, turn) => {
    if (turn.endTime) {
      const diffInMs = turn.endTime.getTime() - turn.startTime.getTime();
      return acc + diffInMs;
    }
    return acc;
  }, 0);

  return totalHours / 3600000; 
};
