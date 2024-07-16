import { Router } from 'express';
import SongController from '../../controllers/song.controller';

const router = Router();

router.post('/upload', SongController.uploadSong);

export default router;
