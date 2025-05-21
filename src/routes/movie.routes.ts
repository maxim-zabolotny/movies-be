import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import { upload } from '../config/multer.config';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const movieController = new MovieController();

router.post('/', authMiddleware, movieController.create);
router.get('/:id', authMiddleware, movieController.getById);
router.patch('/:id', authMiddleware, movieController.update);
router.delete('/:id', authMiddleware, movieController.delete);
router.get('/', authMiddleware, movieController.getAll);
router.post('/import', authMiddleware, upload.single('movies'), movieController.importMovies);

export default router;