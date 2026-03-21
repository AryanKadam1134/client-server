import { Router } from "express";

import {
  addSkillCategory,
  deleteSkillCategory,
  getAllCategoryWiseSkills,
  updateSkillCategory,
} from "../../controllers/private/skillCategory.controller.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";

const skillCategoryRouter = Router();

skillCategoryRouter.route("/").post(verifyJWT, addSkillCategory);

skillCategoryRouter.route("/:categoryId").patch(verifyJWT, updateSkillCategory);

skillCategoryRouter
  .route("/:categoryId")
  .delete(verifyJWT, deleteSkillCategory);

skillCategoryRouter.route("/").get(verifyJWT, getAllCategoryWiseSkills);

export default skillCategoryRouter;
