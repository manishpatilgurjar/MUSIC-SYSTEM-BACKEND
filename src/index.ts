import dotenv from "dotenv";
import app from './app';
import connectDB from './db';
const port = 8000;

dotenv.config();

connectDB().then(() => {
    const PORT = process.env.PORT!;
    app.listen(port, '0.0.0.0', () => {
        console.log(`⚙️  Server is running on port ${port}`);
      });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
});

