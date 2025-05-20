import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';

const router = Router();
const movieController = new MovieController();

router.post('/', movieController.create);
router.get('/:id', movieController.getById);
router.patch('/:id', movieController.update);
router.delete('/:id', movieController.delete);

export default router;