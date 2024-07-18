
import { Request } from 'express';
import Song from '../models/songs';
import { handleResponse } from '../helpers/responseFormate';
import { ResponseCodes } from '../utils/responseCodes';
import { ResponseMessages } from '../utils/responseMessages';
import { upload } from '../configs/s3';

interface UploadedFile extends Express.Multer.File {
    location: string;
}
class SongService {
    public async uploadSong(req: Request) {
        return new Promise((resolve, reject) => {
            upload.fields([{ name: 'song', maxCount: 1 }, { name: 'poster', maxCount: 1 }])(req, null as any, async (err: any) => {
                if (err) {
                    return reject(handleResponse(ResponseCodes.notFound, err.message));
                }

                if (!req.files || !('song' in req.files) || !('poster' in req.files)) {
                    return reject(handleResponse(ResponseCodes.notFound, "Missing files"));
                }

                const { title, artist, album, genre, releaseDate } = req.body;

                const songFile = (req.files as { [fieldname: string]: UploadedFile[] }).song[0];
                const posterFile = (req.files as { [fieldname: string]: UploadedFile[] }).poster[0];

                const songUrl = songFile.location;
                const posterUrl = posterFile.location;

                const newSong = new Song({
                    title,
                    artist,
                    album,
                    genre,
                    releaseDate,
                    songUrl,
                    posterUrl,
                });

                await newSong.save();
                resolve(handleResponse(ResponseCodes.success, ResponseMessages.songUploaded, newSong));
            });
        });
    }
}

export default new SongService();
