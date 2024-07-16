// import { Request } from 'express';
// import Song from '../models/songs';
// import { handleResponse, internalServerError } from '../helpers/responseFormate';
// import { ResponseCodes } from '../utils/responseCodes';
// import { ResponseMessages } from '../utils/responseMessages';
// import s3 from '../configs/s3';
// import multer from 'multer';
// import multerS3 from 'multer-s3';

// const upload = multer({
//     storage: multerS3({
//         s3: s3 as any, // Use 'any' type to bypass the type error
//         bucket:'music-app-manish',
//         acl: 'public-read',
//         key: function (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) {
//             const folder = file.fieldname === 'song' ? 'songs' : 'posters';
//             cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
//         },
//     }),
// });

// class SongService {
//     public async uploadSong(req: Request) {
//         return new Promise((resolve, reject) => {
//             upload.fields([{ name: 'song', maxCount: 1 }, { name: 'poster', maxCount: 1 }])(req, null as any, async (err: any) => {
//                 if (err) {
//                     return reject(handleResponse(ResponseCodes.notFound, err.message));
//                 }

//                 if (!req.files || !(req.files as { [fieldname: string]: Express.Multer.File[] }).song || !(req.files as { [fieldname: string]: Express.Multer.File[] }).poster) {
//                     return reject(handleResponse(ResponseCodes.notFound, "Missing files"));
//                 }

//                 const { title, artist, album, genre, releaseDate } = req.body;

//                 const songFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).song[0];
//                 const posterFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).poster[0];

//                 const songUrl = (songFile as any).location; // Use 'any' type to access 'location'
//                 const posterUrl = (posterFile as any).location; // Use 'any' type to access 'location'

//                 const newSong = new Song({
//                     title,
//                     artist,
//                     album,
//                     genre,
//                     releaseDate,
//                     songUrl,
//                     posterUrl,
//                 });

//                 await newSong.save();
//                 resolve(handleResponse(ResponseCodes.success, ResponseMessages.songUploaded, newSong));
//             });
//         });
//     }
// }

// // export default new SongService();
// import { Request } from 'express';
// import Song from '../models/songs';
// import { handleResponse, internalServerError } from '../helpers/responseFormate';
// import { ResponseCodes } from '../utils/responseCodes';
// import { ResponseMessages } from '../utils/responseMessages';
// import s3 from '../configs/s3';
// import multer from 'multer';
// import { S3Client } from "@aws-sdk/client-s3";
// import multerS3 from 'multer-s3';

// const s3Client = new S3Client({
//     region:'ap-south-1',
//     credentials: {
//         accessKeyId:'AKIAQ3EGRG6PQL7IVWXL',
//         secretAccessKey:'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',
//     },
// });

// const upload = multer({
//     storage: multerS3({
//         s3: s3Client,
//         bucket:'music-bucket-manish',
//         acl: 'public-read',
//         key: function (req: Request, file: any, cb: any) {
//             const folder = file.fieldname === 'song' ? 'songs' : 'posters';
//             cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
//         },
//     }),
// });

// class SongService {
//     public async uploadSong(req: Request) {
//         return new Promise((resolve, reject) => {
//             upload.fields([{ name: 'song', maxCount: 1 }, { name: 'poster', maxCount: 1 }])(req, null as any, async (err: any) => {
//                 if (err) {
//                     return reject(handleResponse(ResponseCodes.notFound, err.message));
//                 }

//                 if (!req.files || !('song' in req.files) || !('poster' in req.files)) {
//                     return reject(handleResponse(ResponseCodes.notFound, "Missing files"));
//                 }

//                 const { title, artist, album, genre, releaseDate } = req.body;

//                 const songFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).song[0];
//                 const posterFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).poster[0];

//                 const songUrl = songFile.location;
//                 const posterUrl = posterFile.location;

//                 const newSong = new Song({
//                     title,
//                     artist,
//                     album,
//                     genre,
//                     releaseDate,
//                     songUrl,
//                     posterUrl,
//                 });

//                 await newSong.save();
//                 resolve(handleResponse(ResponseCodes.success, ResponseMessages.songUploaded, newSong));
//             });
//         });
//     }
// }

// export default new SongService();
import { Request } from 'express';
import Song from '../models/songs';
import { handleResponse } from '../helpers/responseFormate';
import { ResponseCodes } from '../utils/responseCodes';
import { ResponseMessages } from '../utils/responseMessages';
import { S3Client } from "@aws-sdk/client-s3";
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../configs/s3';

interface UploadedFile extends Express.Multer.File {
    location: string;
}

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: 'AKIAQ3EGRG6P7Y32RRI7',
        secretAccessKey: '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',
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket:'manish-patil',
        key: function (req: Request, file: any, cb: any) {
            const folder = file.fieldname === 'song' ? 'songs' : 'posters';
            cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
        },
    }),
});

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
