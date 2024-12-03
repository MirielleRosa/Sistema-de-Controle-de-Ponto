"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'controle_ponto', process.env.DB_USER || 'postgres', process.env.DB_PASS || 'postgres', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
});
exports.default = sequelize;
