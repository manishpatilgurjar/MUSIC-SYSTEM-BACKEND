import { S3Client } from "@aws-sdk/client-s3";
import { Request } from "express";
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from "dotenv";
dotenv.config();

export const s3 = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
        accessKeyId: process.env.S3_KEY!,
        secretAccessKey: process.env.S3_SECRET!,
    },
});

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET!,
        key: (req: Request, file: Express.Multer.File, cb) => {
            const folder = file.fieldname === 'song' ? 'songs' : 'posters';
            cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
        },
    }),
});

