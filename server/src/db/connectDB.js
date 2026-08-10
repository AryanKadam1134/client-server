import dns from "node:dns";
import mongoose from "mongoose";

import { isProduction } from "../constants.js";

if (!isProduction) dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  return await mongoose.connect(
    `${process.env.MONGODB_URL}/${process.env.DB_NAME}`,
  );
};

export { connectDB };
