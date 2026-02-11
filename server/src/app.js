import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

import filterRoutes from "./routes/filter.routes.js";

app.use("/api/filter", filterRoutes);

export default app;
