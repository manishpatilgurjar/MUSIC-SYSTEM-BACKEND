// import AWS from 'aws-sdk';
// import dotenv from 'dotenv';
// import { S3Client } from '@aws-sdk/client-s3';

// AWS.config.update({
//     accessKeyId:'AKIAQ3EGRG6PQL7IVWXL' ,
//     secretAccessKey:'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',
//     region:"ap-south-1",
// });

// const s3 = new S3Client({
//     region:'ap-south-1',
    // credentials: {
    //     accessKeyId:'AKIAQ3EGRG6PQL7IVWXL',
    //     secretAccessKey:'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',
    // },
// });

// export default s3;

import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
        region:'ap-south-1',
    credentials: {
        accessKeyId:'AKIAQ3EGRG6P7Y32RRI7',
        secretAccessKey:'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',
    },
});

export default s3;
