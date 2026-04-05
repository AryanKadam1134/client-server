import { Router } from "express";

import {
  manageSocialPlatforms,
  getAllUserSocialPlatforms,
  deleteSocialAccount,
  addSocialAccount,
  updateSocialAccount,
} from "../../controllers/private/socialAccount.controller.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getSocialAccountById } from "../../middlewares/socialAccount.middleware.js";

const socialAccountRouter = Router();

socialAccountRouter.use(verifyJWT);

socialAccountRouter.route("/manage").post(manageSocialPlatforms);

socialAccountRouter
  .route("/")
  .post(addSocialAccount)
  .get(getAllUserSocialPlatforms);

socialAccountRouter
  .route("/:accountId")
  .patch(getSocialAccountById, updateSocialAccount)
  .delete(getSocialAccountById, deleteSocialAccount);

export default socialAccountRouter;
