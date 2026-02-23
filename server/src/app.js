import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

import filterRoutes from "./routes/filter.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/filter", filterRoutes);

app.use("/api/user", userRouter);

export default app;
