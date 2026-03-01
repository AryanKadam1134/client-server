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

// Private
import filterRoutes from "./routes/private/filter.routes.js";
import userRouter from "./routes/private/user.routes.js";
import socialAccountRouter from "./routes/private/socialAccount.routes.js";
import skillCategoryRouter from "./routes/private/skillCategory.routes.js";
import skillRouter from "./routes/private/skill.routes.js";

app.use("/api/admin/filter", filterRoutes);

app.use("/api/admin/user", userRouter);

app.use("/api/admin/social", socialAccountRouter);

app.use("/api/admin/skillCategory", skillCategoryRouter);

app.use("/api/admin/skill", skillRouter);

// Public
import portfolioRouter from "./routes/public/portfolio.routes.js";

app.use("/api/portfolio", portfolioRouter);

export default app;
