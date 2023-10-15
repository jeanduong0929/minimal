import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI! as string);
  } catch (error: any) {
    console.error("Error connecting to MongoDB: ", error.message);
  }
};

export default connectDB;
