import dotenv from "dotenv";
import app from './app';
import connectDB from './db';

dotenv.config();

connectDB().then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`⚙️\t Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
});
