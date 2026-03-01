import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { addSkill } from "../../controllers/private/skill.controller.js";

const skillRouter = Router();

skillRouter.route("/add").post(verifyJWT, addSkill);

export default skillRouter;
