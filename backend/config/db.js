const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '.env');
const envExamplePath = path.resolve(__dirname, '..', '.env.example');

dotenv.config({
  path: require('fs').existsSync(envPath) ? envPath : envExamplePath
});

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        `MONGO_URI is not set. Create ${envPath} or define MONGO_URI before starting the backend.`
      );
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
