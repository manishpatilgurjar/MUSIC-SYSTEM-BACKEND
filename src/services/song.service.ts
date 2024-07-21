import { Request, Response } from 'express';
import Song from '../models/songs';
import SongView from '../models/songView';
import { handleResponse, internalServerError } from '../helpers/responseFormate';
import { ResponseCodes } from '../utils/responseCodes';
import { ResponseMessages } from '../utils/responseMessages';
import { upload, s3 } from '../configs/s3';
import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface UploadedFile extends Express.Multer.File {
    location: string;
    key: string;
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
                const songKey = songFile.key;
                const posterKey = posterFile.key;

                const newSong = new Song({
                    title,
                    artist,
                    album,
                    genre,
                    releaseDate,
                    songUrl,
                    posterUrl,
                    songKey,
                    posterKey,
                });

                await newSong.save();
                resolve(handleResponse(ResponseCodes.success, ResponseMessages.songUploaded, newSong));
            });
        });
    }

    public async deleteSong(req: Request) {
        try {
            const { songId } = req.body;
            const song = await Song.findById(songId);
            if (!song) {
                return handleResponse(ResponseCodes.notFound, ResponseMessages.songNotFound);
            }

            // Delete from S3
            const deleteSongParams = {
                Bucket: process.env.S3_BUCKET!,
                Key: song.songKey,
            };
            const deletePosterParams = {
                Bucket: process.env.S3_BUCKET!,
                Key: song.posterKey,
            };
            await s3.send(new DeleteObjectCommand(deleteSongParams));
            await s3.send(new DeleteObjectCommand(deletePosterParams));
            await song.deleteOne();

            return handleResponse(ResponseCodes.success, ResponseMessages.songDeleted);
        } catch (error) {
            return internalServerError;
        }
    }

    public async getSongs(req: Request) {
        try {
            const songs = await Song.find();
            return handleResponse(ResponseCodes.success, ResponseMessages.songsFetched, songs);
        } catch (error) {
            return internalServerError;
        }
    }

    public async getSongById(req: Request) {
        try {
            const { songId } = req.query;
            const song = await Song.findById(songId);
            if (!song) {
                return handleResponse(ResponseCodes.notFound, ResponseMessages.songNotFound);
            }

            // Increment the view count
            await SongView.findOneAndUpdate(
                { song: songId },
                { $inc: { views: 1 } },
                { new: true, upsert: true }
            );

            // Generate pre-signed URL for song
            const getSongParams = {
                Bucket: process.env.S3_BUCKET!,
                Key: song.songKey,
            };
            const songUrl = await getSignedUrl(s3, new GetObjectCommand(getSongParams), { expiresIn: 3600 });

            // Generate pre-signed URL for poster
            const getPosterParams = {
                Bucket: process.env.S3_BUCKET!,
                Key: song.posterKey,
            };
            const posterUrl = await getSignedUrl(s3, new GetObjectCommand(getPosterParams), { expiresIn: 3600 });

            // Return the song details with pre-signed URLs
            const songDetails = {
                ...song.toObject(),
                songUrl,
                posterUrl,
            };

            return handleResponse(ResponseCodes.success, ResponseMessages.songFetched, songDetails);
        } catch (error) {
            return internalServerError;
        }
    }

    public async getSongViews(req: Request) {
        try {
            const { songId } = req.query;
            const songView = await SongView.findOne({ song: songId });
            if (!songView) {
                return handleResponse(ResponseCodes.notFound, ResponseMessages.songNotFound);
            }
            return handleResponse(ResponseCodes.success, ResponseMessages.songFetched, { views: songView.views });
        } catch (error) {
            return internalServerError;
        }
    }
}

export default new SongService();
