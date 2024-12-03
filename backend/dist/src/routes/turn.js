"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turnService_1 = require("../services/turnService");
const turnController_1 = require("../controllers/turnController");
const router = (0, express_1.Router)();
const turnService = new turnService_1.TurnService();
const turnController = new turnController_1.TurnController(turnService);
router.post('/start', turnController.startTurn);
router.post('/end/:turnId', turnController.endTurn);
router.get('/total/:userId', turnController.getTotalWorkedHours);
router.get('/history/:userId', turnController.getWorkedHoursHistory);
router.get('/turn-details/:userId/:date', turnController.getTurnDetailsByDate);
router.get('/hours-today/:userId', turnController.getWorkedHoursToday);
exports.default = router;