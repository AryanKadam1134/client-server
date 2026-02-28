import { Router } from "express";

import { getUserByUsername } from "../../controllers/user.controller.js";
import { findUserByUsername } from "../../middlewares/user.middleware.js";
import { getUserSocialAccounts } from "../../controllers/socialAccount.controller.js";

const portfolioRouter = Router();

portfolioRouter.route("/:username/details").get(findUserByUsername, getUserByUsername);

portfolioRouter
  .route("/:username/social-platforms")
  .get(findUserByUsername, getUserSocialAccounts);

export default portfolioRouter;
