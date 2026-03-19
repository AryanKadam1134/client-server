import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addSkill,
  deleteSkill,
  getAllSkillWithCategory,
  updateSkill,
} from "../../controllers/private/skill.controller.js";

const skillRouter = Router();

skillRouter.route("/").post(verifyJWT, addSkill);

skillRouter.route("/:skillId").patch(verifyJWT, updateSkill);

skillRouter.route("/:skillId").delete(verifyJWT, deleteSkill);

skillRouter.route("/").get(verifyJWT, getAllSkillWithCategory);

export default skillRouter;
