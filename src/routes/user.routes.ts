import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();
router.post('/', userController.create.bind(userController));

export default router; 