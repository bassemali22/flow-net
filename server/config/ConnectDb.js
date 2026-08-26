import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connecting success");
  } catch (error) {
    console.log("Connection failed", error);
  }
};

export default connectDb;
