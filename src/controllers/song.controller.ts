import { Request, Response } from 'express';
import SongService from '../services/song.service';
import { internalServerError } from '../helpers/responseFormate';

class SongController {
    public async uploadSong(req: Request, res: Response): Promise<void> {
        try {
            const response = await SongService.uploadSong(req);
            res.json(response);
        } catch (error) {
            console.log(error)
            res.json(internalServerError);
        }
    }
}

export default new SongController();
