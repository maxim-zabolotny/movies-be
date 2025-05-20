import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';

const router = Router();
const sessionController = new SessionController();
router.post('/', sessionController.create.bind(sessionController));

export default router;