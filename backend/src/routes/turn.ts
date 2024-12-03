import { Router } from 'express';
import { TurnService } from '../services/turnService';
import { TurnController } from '../controllers/turnController';

const router = Router();

const turnService = new TurnService();
const turnController = new TurnController(turnService);

router.post('/start', turnController.startTurn);
router.post('/end/:turnId', turnController.endTurn);
router.get('/total/:userId', turnController.getTotalWorkedHours);
router.get('/history/:userId', turnController.getWorkedHoursHistory);
router.get('/turn-details/:userId/:date', turnController.getTurnDetailsByDate);
router.get('/hours-today/:userId', turnController.getWorkedHoursToday);

export default router;
