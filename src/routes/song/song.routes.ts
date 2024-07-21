// import { Router } from 'express';
// import SongController from '../../controllers/song.controller';
// import ValidateUserRole from '../../middlewares/users/user.validate';

// const router = Router();

// router.post('/upload', ValidateUserRole.checkUserRole, SongController.uploadSong);
// router.get('/get', SongController.getSong);
// router.post('/delete', ValidateUserRole.checkUserRole, SongController.deleteSong);

// export default router;
import { Router } from 'express';
import SongController from '../../controllers/song.controller';
import ValidateUserRole from '../../middlewares/users/user.validate';

const router = Router();

router.post('/upload', ValidateUserRole.checkUserRole, SongController.uploadSong);
router.get('/get', SongController.getSong);
router.post('/delete', ValidateUserRole.checkUserRole, SongController.deleteSong);
router.get('/songs', SongController.getSongs);  // Route for getSongs

export default router;
