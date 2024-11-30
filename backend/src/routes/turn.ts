import { Router } from 'express';
import * as turn from '../controllers/turnController';

const router = Router();

router.post('/start', turn.startTurn);  
router.post('/end/:turnId', turn.endTurn);  
router.get('/total/:userId', turn.getTotalWorkedHours);

export default router;
