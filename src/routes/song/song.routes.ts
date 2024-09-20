import { Router } from 'express';
import SongController from '../../controllers/song.controller';
import ValidateUserRole from '../../middlewares/users/user.validate';

const router = Router();

router.post('/upload', ValidateUserRole.checkUserRole, SongController.uploadSong);
router.get('/get/:id', SongController.getSong);
router.delete('/delete/:id', ValidateUserRole.checkUserRole, SongController.deleteSong);
router.get('/songs', SongController.getSongs);  // Route for getSongs
export default router;
