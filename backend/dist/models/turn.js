"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Turn extends sequelize_1.Model {
}
Turn.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    totalHours: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'controle_ponto',
});
exports.default = Turn;
