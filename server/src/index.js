import "dotenv/config";
import app from "./app.js";

import { connectDB } from "./db/connectDB.js";

const port = process.env.PORT || 3000;

connectDB()
  .then((res) => {
    console.log("MongoDB is connected successfully!", res.connection.host);

    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });

    app.on("error", (error) => {
      console.error("Error listening to server: ", error);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed!\n", error);
  });
