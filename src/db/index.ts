import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://root:passPASS@cluster0.qqwuk5s.mongodb.net/music-app?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
    } as mongoose.ConnectOptions);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
