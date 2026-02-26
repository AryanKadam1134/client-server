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

import privateFilterRoutes from "./routes/private/filter.routes.js";
import privateUserRouter from "./routes/private/user.routes.js";
import privateSocialAccountRouter from "./routes/private/socialAccount.routes.js";
import portfolioRouter from "./routes/public/portfolio.routes.js";

app.use("/api/admin/filter", privateFilterRoutes);

app.use("/api/admin/user", privateUserRouter);

app.use("/api/admin/social", privateSocialAccountRouter);

app.use("/api/portfolio", portfolioRouter);

export default app;
