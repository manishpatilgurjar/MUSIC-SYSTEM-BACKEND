import { Request, Response } from 'express';
import SongService from '../services/song.service';
import { handleResponse, internalServerError } from '../helpers/responseFormate';
import { Role } from '../utils/roles';
import { Permission } from '../utils/permissions';
import { ResponseCodes } from '../utils/responseCodes';

class SongController {
    public async uploadSong(req: Request, res: Response): Promise<void> {
        try {
            if (req.userRole && req.userRole.name === Role.Admin && req.userPermissions && req.userPermissions.includes(Permission.Upload)) {
                console.log(req.userPermissions)
                const response = await SongService.uploadSong(req);
                res.json(response);
            } else {
                res.status(403).json(handleResponse(ResponseCodes.notFound, "Permission denied")); // Update response
            }
        } catch (error) {
            res.status(500).json(error); // Return error response
        }
    }

    public async getSong(req: Request, res: Response): Promise<void> {
        try {
            const response = await SongService.getSongById(req);
            res.json(response);
        } catch (error) {
            res.json(internalServerError);
        }
    }

    public async deleteSong(req: Request, res: Response): Promise<void> {
        try {
            if (req.userRole && req.userRole.name === Role.Admin && req.userPermissions && req.userPermissions.includes(Permission.Delete)) {
                const response = await SongService.deleteSong(req);
                res.json(response);
            } else {
                res.status(403).json(internalServerError);
            }
        } catch (error) {
            res.json(internalServerError);
        }
    }

    public async getSongs(req: Request, res: Response): Promise<void> {
        try {
            const response = await SongService.getSongs(req);
            res.json(response);
        } catch (error) {
            res.json(internalServerError);
        }
    }
}

export default new SongController();
