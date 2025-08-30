const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sayantanhalder78_db_user:rAkp8NGIKFBambou@hydrolink.ab2ycyj.mongodb.net/?retryWrites=true&w=majority&appName=HydroLink');
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;