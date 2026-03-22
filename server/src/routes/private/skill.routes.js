import { Router } from "express";

import {
  addSkill,
  deleteSkill,
  getAllSkillWithCategory,
  updateSkill,
} from "../../controllers/private/skill.controller.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getSkillById } from "../../middlewares/skill.middleware.js";

const skillRouter = Router();

skillRouter.use(verifyJWT);

skillRouter.route("/").post(addSkill).get(getAllSkillWithCategory);

skillRouter
  .route("/:skillId")
  .patch(getSkillById, updateSkill)
  .delete(getSkillById, deleteSkill);

export default skillRouter;
