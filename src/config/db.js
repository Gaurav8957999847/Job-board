import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 5000;

const connectDB = async () => {
  try {
    const connectionDB = await mongoose.connect(MONGO_URL);
    console.log(`✅ MongoDB Connected! Host: ${connectionDB.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
  }
} 

export { connectDB };