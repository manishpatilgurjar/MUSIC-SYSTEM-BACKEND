import { Request, Response } from 'express';
import Song from '../models/songs';
import SongView from '../models/songView';
import { handleResponse, internalServerError } from '../helpers/responseFormate';
import { ResponseCodes } from '../utils/responseCodes';
import { ResponseMessages } from '../utils/responseMessages';
import { s3 } from '../configs/s3';
import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uploadFilesToS3 } from '../helpers/upload';


interface UploadedFile extends Express.Multer.File {
    location: string;
    key: string;
}

class SongService {
    public async uploadSong(req: Request) {
        try {
            const files = await uploadFilesToS3(req); // Use the helper function
            const songFile = (files as { [fieldname: string]: UploadedFile[] }).song[0];
            const posterFile = (files as { [fieldname: string]: UploadedFile[] }).poster[0];
            const songUrl = songFile.location;
            const posterUrl = posterFile.location;
            const songKey = songFile.key;
            const posterKey = posterFile.key;
            const { title, artist, album, genre, releaseDate } = req.body;

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
            return handleResponse(ResponseCodes.success, ResponseMessages.songUploaded, newSong);
        } catch (error) {
            return internalServerError; // Handle error properly
        }
    }

    public async deleteSong(req: Request) {
        try {
            const  {id}  = req.params;
            const song = await Song.findById(id);
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
            const { page = 1, pageSize = 10, search, genre, artist, sort = 'title', order = 'asc' } = req.query;
            const query: any = {};

            // Search filter
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { artist: { $regex: search, $options: 'i' } },
                    { album: { $regex: search, $options: 'i' } },
                ];
            }

            // Genre filter
            if (genre) {
                query.genre = genre;
            }

            // Artist filter
            if (artist) {
                query.artist = artist;
            }

            // Sorting
            const sortOrder = order === 'desc' ? -1 : 1;
            const sortBy = sort === 'views' ? 'views' : (sort as string);

            const songs = await Song.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'songviews',
                        localField: '_id',
                        foreignField: 'song',
                        as: 'viewsData'
                    }
                },
                {
                    $addFields: {
                        views: { $arrayElemAt: ['$viewsData.views', 0] }
                    }
                },
                { $unset: 'viewsData' },
                { $sort: { [sortBy]: sortOrder } },
                { $skip: (+page - 1) * +pageSize },
                { $limit: +pageSize },
            ]);

            const totalSongs = await Song.countDocuments(query);

            const response = {
                songs,
                pagination: {
                    total: totalSongs,
                    page: +page,
                    pageSize: +pageSize,
                    totalPages: Math.ceil(totalSongs / +pageSize),
                },
            };

            return handleResponse(ResponseCodes.success, ResponseMessages.songsFetched, response);
        } catch (error) {
            return internalServerError;
        }
    }

    public async getSongById(req: Request) {
        try {
            const {id} = req.params;
            const song = await Song.findById(id);
            if (!song) {
                return handleResponse(ResponseCodes.notFound, ResponseMessages.songNotFound);
            }

            // Increment the view count
            await SongView.findOneAndUpdate(
                { song: id },
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
