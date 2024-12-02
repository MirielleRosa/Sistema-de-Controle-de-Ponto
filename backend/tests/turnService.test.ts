import { TurnService } from '../src/services/turnService';
import Turn from '../src/models/turn';
import sequelize from 'sequelize-mock';

const DBConnectionMock = new sequelize();
const TurnMock = DBConnectionMock.define('Turn', {
  userId: 1,
  startTime: new Date(),
  endTime: null,
  totalHours: null,
});

jest.mock('../src/models/turn', () => TurnMock);

describe('TurnService', () => {
  let turnService: TurnService;

  beforeEach(() => {
    turnService = new TurnService();
  });

  it('should start a turn', async () => {
    const userId = 1;
    const turn = await turnService.startTurn(userId);

    expect(turn.userId).toBe(userId);
    expect(turn.startTime).toBeInstanceOf(Date);
    expect(turn.endTime).toBeNull();
    expect(turn.totalHours).toBeNull();
  });

  it('should end a turn', async () => {
    const turnId = 1;
    const turn = await turnService.endTurn(turnId);

    expect(turn.endTime).toBeInstanceOf(Date);
    expect(turn.totalHours).toBeGreaterThan(0);
  });

  it('should throw an error if turn is not found', async () => {
    TurnMock.findByPk = jest.fn().mockReturnValue(null);

    try {
      await turnService.endTurn(999); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('Turno não encontrado');
      }
    }
  });
});
