import mongoose from "mongoose";
import dotenv from "dotenv";
import { error } from "console";

// Load environment variables from .env file
dotenv.config();

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.ATLASMONGO_URI!, {});
    console.log("Connected to MongoDB-Data");
  } catch (err) {
    console.error("MongoDB-Data Connection Error", err);
  }
};

// Disconnect from MongoDB when the process exits
process.on("exit", () => {
  mongoose.disconnect();
});
process.on("unhandledRejection", (error: any) => {
  process.exit(1);
});
