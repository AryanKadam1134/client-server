import { Router } from "express";

import { findUserByUsername } from "../../middlewares/user.middleware.js";
import {
  getCategoryWiseSkills,
  getExperiences,
  getProjects,
  getSkillWithCategory,
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

portfolioRouter
  .route("/:username/skills")
  .get(findUserByUsername, getSkillWithCategory);

portfolioRouter
  .route("/:username/categories")
  .get(findUserByUsername, getCategoryWiseSkills);

portfolioRouter
  .route("/:username/projects")
  .get(findUserByUsername, getProjects);

portfolioRouter
  .route("/:username/experiences")
  .get(findUserByUsername, getExperiences);

export default portfolioRouter;
