const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try Atlas first, then fall back to local MongoDB
    const atlasUri = process.env.MONGO_URI || 'mongodb+srv://sayantanhalder78_db_user:rAkp8NGIKFBambou@hydrolink.ab2ycyj.mongodb.net/?retryWrites=true&w=majority&appName=HydroLink';
    const localUri = 'mongodb://localhost:27017/hydrolink';
    
    try {
      await mongoose.connect(atlasUri);
      console.log('MongoDB Atlas connected successfully.');
    } catch (atlasError) {
      console.log('Atlas connection failed, trying local MongoDB...');
      await mongoose.connect(localUri);
      console.log('Local MongoDB connected successfully.');
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Running in offline mode - some features may not work');
    // Don't exit in development, allow the server to run without DB
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;