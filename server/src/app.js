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
import userRouter from "./routes/user.routes.js";

app.use("/api/filter", filterRoutes);

app.use("/api/user", userRouter);

export default app;
