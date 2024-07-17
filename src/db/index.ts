import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_SRV!, {
    } as mongoose.ConnectOptions);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
