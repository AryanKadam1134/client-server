import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addSkillCategory,
  deleteSkillCategory,
  getAllCategoryWiseSkills,
  updateSkillCategory,
} from "../../controllers/private/skillCategory.controller.js";

const skillCategoryRouter = Router();

skillCategoryRouter.route("/").post(verifyJWT, addSkillCategory);

skillCategoryRouter.route("/:categoryId").patch(verifyJWT, updateSkillCategory);

skillCategoryRouter
  .route("/:categoryId")
  .delete(verifyJWT, deleteSkillCategory);

skillCategoryRouter.route("/").get(verifyJWT, getAllCategoryWiseSkills);

export default skillCategoryRouter;
