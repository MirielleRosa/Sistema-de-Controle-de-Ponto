"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turnService_1 = require("../services/turnService");
const turnController_1 = require("../controllers/turnController");
const router = (0, express_1.Router)();
// Instanciando o serviço e o controlador
const turnService = new turnService_1.TurnService();
const turnController = new turnController_1.TurnController(turnService);
// Definindo as rotas
router.post('/start', turnController.startTurn);
router.post('/end/:turnId', turnController.endTurn);
router.get('/total/:userId', turnController.getTotalWorkedHours);
router.get('/history/:userId', turnController.getWorkedHoursHistory);
exports.default = router;
