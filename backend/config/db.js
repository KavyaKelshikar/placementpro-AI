const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connection options for MongoDB connection stability and performance
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placement_portal', {
      autoIndex: true, // Auto-build indexes (can be set to false in production for performance)
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}. Proceeding with web server initialization (DB dependent routes will be inactive).`);
  }
};

module.exports = connectDB;
