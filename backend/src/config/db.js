const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri, {
      // options are managed by mongoose newer versions
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
