// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import multer from 'multer'
// import bodyParser from 'body-parser';

// const app = express();
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));
// import userRouter from "./routes/users/user.route";
// import songRoutes from "./routes/song/song.routes";
// // import recipeRouter from "./routes/recepie.routes"
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use("/api/v1/users", userRouter);
// app.use('/api/songs', songRoutes);
// // app.use("/api/v1/recipe",recipeRouter)

// export { app };

// // import express from 'express';
// // import songRoutes from './routes/songRoutes';
// // import bodyParser from 'body-parser';
// // import multer from 'multer';

// // const app = express();

// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

// // app.use('/api/songs', songRoutes);

// // const port = process.env.PORT || 3000;
// // app.listen(port, () => {
// //     console.log(`Server running on port ${port}`);
// // });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import connectDB from "./db";
import userRouter from "./routes/users/user.route";
import songRoutes from "./routes/song/song.routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
app.use("/api/v1/users", userRouter);
app.use('/api/songs', songRoutes);

export default app;
