import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addSkillCategory,
  deleteSkillCategory,
  updateSkillCategory,
} from "../../controllers/private/skillCategory.controller.js";

const skillCategoryRouter = Router();

skillCategoryRouter.route("/add").post(verifyJWT, addSkillCategory);

skillCategoryRouter
  .route("/:categoryId/update")
  .patch(verifyJWT, updateSkillCategory);

skillCategoryRouter
  .route("/:categoryId/delete")
  .delete(verifyJWT, deleteSkillCategory);

export default skillCategoryRouter;
