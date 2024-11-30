import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Turn extends Model {
  public id!: number;
  public userId!: number;
  public startTime!: Date;
  public endTime!: Date | null;
  public totalHours!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Turn.init(
  {
    userId: {
      type: DataTypes.INTEGER,
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
