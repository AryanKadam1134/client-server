import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addSocialPlatforms,
  getUserSocialAccounts,
} from "../controllers/socialAccount.controller.js";

const socialAccountRouter = Router();

socialAccountRouter
  .route("/addSocialAccounts")
  .post(verifyJWT, addSocialPlatforms);

socialAccountRouter
  .route("/userSocialAccounts")
  .post(verifyJWT, getUserSocialAccounts);

export default socialAccountRouter;
