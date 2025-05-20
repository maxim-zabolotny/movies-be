import { Router } from 'express';
import movieRoutes from './movie.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/movies', movieRoutes);
router.use('/users', userRoutes);

export default router;