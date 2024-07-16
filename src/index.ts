 import express from 'express';
 import connectDB from './db';

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Routes
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

import dotenv from "dotenv"
import {app} from './app.js'

dotenv.config({
    path: './.env'
});
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!! ", err);
    });

