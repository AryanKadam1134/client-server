import { Router } from "express";

import {
  manageSocialPlatforms,
  getAllUserSocialPlatforms,
  deleteSocialAccount,
} from "../../controllers/private/socialAccount.controller.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";

const socialAccountRouter = Router();

socialAccountRouter.use(verifyJWT);

socialAccountRouter.route("/manage").post(manageSocialPlatforms);

socialAccountRouter.route("/:accountId").delete(deleteSocialAccount);

socialAccountRouter.route("/").get(getAllUserSocialPlatforms);

export default socialAccountRouter;
