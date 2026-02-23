import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/connectDB.js";

dotenv.config({ path: "./env" });

const port = process.env.PORT;

connectDB()
  .then((res) => {
    console.log("MongoDB is connected successfully!", res.connection.host);

    app.listen(port, () => {
      console.log(`Server is listening on post: ${port}`);
    });

    app.on("error", (error) => {
      console.error("Error listening to server: ", error);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed!", error);
  });
