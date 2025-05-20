import { Router } from 'express';
import movieRoutes from './movie.routes';
import userRoutes from './user.routes';
import sessionRoutes from './session.routes';

const router = Router();

router.use('/movies', movieRoutes);
router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);

export default router;