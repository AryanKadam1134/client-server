import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  manageSocialPlatforms,
  getAllUserSocialPlatforms,
} from "../../controllers/private/socialAccount.controller.js";

const socialAccountRouter = Router();

socialAccountRouter.route("/manage").post(verifyJWT, manageSocialPlatforms);

socialAccountRouter.route("/all").get(verifyJWT, getAllUserSocialPlatforms);

export default socialAccountRouter;
