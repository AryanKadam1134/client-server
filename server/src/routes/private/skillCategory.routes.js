import { Router } from "express";

import {
  addSkillCategory,
  deleteSkillCategory,
  getAllCategoryWiseSkills,
  updateSkillCategory,
} from "../../controllers/private/skillCategory.controller.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getCategoryById } from "../../middlewares/skillCategory.middleware.js";

const skillCategoryRouter = Router();

skillCategoryRouter.use(verifyJWT);

skillCategoryRouter
  .route("/")
  .post(addSkillCategory)
  .get(getAllCategoryWiseSkills);

skillCategoryRouter
  .route("/:categoryId")
  .patch(getCategoryById, updateSkillCategory)
  .delete(getCategoryById, deleteSkillCategory);

export default skillCategoryRouter;
