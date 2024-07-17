import { Request, Response } from 'express';
import SongService from '../services/song.service';
import { internalServerError } from '../helpers/responseFormate';

class SongController {
    public async uploadSong(req: Request, res: Response): Promise<void> {
        try {
            if (req.userRole && req.userRole.name === 'admin' && req.userPermissions && req.userPermissions.includes('create')) {
                const response = await SongService.uploadSong(req);
                res.json(response);
            } else {
                // Handle the case where userRole is undefined or does not have 'admin' role
                res.status(403).json({ message: 'Unauthorized' });
            }
        } catch (error) {
            res.json(internalServerError);
        }
    }
}

export default new SongController();
