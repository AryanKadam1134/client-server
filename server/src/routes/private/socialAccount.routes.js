import { Router } from "express";

import {
  manageSocialPlatforms,
  getAllUserSocialPlatforms,
} from "../../controllers/private/socialAccount.controller.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";

const socialAccountRouter = Router();

socialAccountRouter.route("/manage").post(verifyJWT, manageSocialPlatforms);

socialAccountRouter.route("/").get(verifyJWT, getAllUserSocialPlatforms);

export default socialAccountRouter;
