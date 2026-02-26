import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addSocialPlatforms,
  getUserSocialAccounts,
} from "../../controllers/socialAccount.controller.js";

const privateSocialAccountRouter = Router();

privateSocialAccountRouter
  .route("/addSocialAccounts")
  .post(verifyJWT, addSocialPlatforms);

privateSocialAccountRouter
  .route("/userSocialAccounts")
  .post(verifyJWT, getUserSocialAccounts);

export default privateSocialAccountRouter;
