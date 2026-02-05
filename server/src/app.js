import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());

import appRoutes from "./routes/app.routes.js";

app.use("/api/app", appRoutes);

export default app;
