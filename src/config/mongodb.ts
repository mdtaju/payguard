import mongoose from "mongoose";

export const createMongoConnection = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        timeoutMS: 30000,
      });
    } catch {
      throw new Error("Internal server error. Connection failed");
    }
  }
};
