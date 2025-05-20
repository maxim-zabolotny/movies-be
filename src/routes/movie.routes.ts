import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';

const router = Router();
const movieController = new MovieController();

router.post('/', movieController.create);

export default router;