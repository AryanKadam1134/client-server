import { Router } from "express";

import {
  manageSocialPlatforms,
  getAllUserSocialPlatforms,
} from "../../controllers/private/socialAccount.controller.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";

const socialAccountRouter = Router();

socialAccountRouter.use(verifyJWT);

socialAccountRouter.route("/manage").post(manageSocialPlatforms);

socialAccountRouter.route("/").get(getAllUserSocialPlatforms);

export default socialAccountRouter;
