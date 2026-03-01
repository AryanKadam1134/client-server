import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addSkill,
  deleteSkill,
  updateSkill,
} from "../../controllers/private/skill.controller.js";

const skillRouter = Router();

skillRouter.route("/add").post(verifyJWT, addSkill);

skillRouter.route("/:skillId/update").patch(verifyJWT, updateSkill);

skillRouter.route("/:skillId/delete").delete(verifyJWT, deleteSkill);

export default skillRouter;
