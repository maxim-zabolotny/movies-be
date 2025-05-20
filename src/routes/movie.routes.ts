import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import { upload } from '../config/multer.config';

const router = Router();
const movieController = new MovieController();

router.post('/', movieController.create);
router.get('/:id', movieController.getById);
router.patch('/:id', movieController.update);
router.delete('/:id', movieController.delete);
router.get('/', movieController.getAll);

router.post('/import', upload.single('movies'), movieController.importMovies);

export default router;