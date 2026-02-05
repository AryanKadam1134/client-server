import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
  return await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
};

export { connectDB };
