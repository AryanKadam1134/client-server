import { Router } from "express";

import { findUserByUsername } from "../../middlewares/user.middleware.js";
import {
  getUserByUsername,
  getUserSocialAccounts,
} from "../../controllers/public/portfolio.controller.js";

const portfolioRouter = Router();

portfolioRouter
  .route("/:username/details")
  .get(findUserByUsername, getUserByUsername);

portfolioRouter
  .route("/:username/social-platforms")
  .get(findUserByUsername, getUserSocialAccounts);

export default portfolioRouter;
