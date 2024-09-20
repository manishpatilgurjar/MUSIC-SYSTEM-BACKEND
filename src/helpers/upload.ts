import { s3, upload } from '../configs/s3';
import { Request } from 'express';
import { handleResponse } from './responseFormate';
import { ResponseCodes } from '../utils/responseCodes';

export const uploadFilesToS3 = async (req: Request) => {
    return new Promise((resolve, reject) => {
        upload.fields([{ name: 'song', maxCount: 1 }, { name: 'poster', maxCount: 1 }])(req, null as any, (err: any) => {
            if (err) {
                return reject(handleResponse(ResponseCodes.notFound, err.message));
            }
            if (!req.files || !('song' in req.files) || !('poster' in req.files)) {
                return reject(handleResponse(ResponseCodes.notFound, "Missing files"));
            }
            resolve(req.files);
        });
    });
};