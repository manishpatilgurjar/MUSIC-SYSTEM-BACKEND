import { Router } from 'express';
import SongController from '../../controllers/song.controller';
import ValidateUserRole from '../../middlewares/users/user.validate'

const router = Router();

router.post('/upload', ValidateUserRole.checkUserRole,SongController.uploadSong);

export default router;
