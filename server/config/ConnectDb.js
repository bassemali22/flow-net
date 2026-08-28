import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected successfully");

    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    throw error;
  }
};

export default connectDb;
