// models/Turn.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Turn as TurnInterface } from '../interfaces/Turn';

class Turn extends Model<TurnInterface> implements TurnInterface {
  public id!: number;
  public userId!: string;
  public startTime!: Date;
  public endTime!: Date | null;
  public totalHours!: number | null;
}

Turn.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'controle_ponto',
  }
);

export default Turn;
