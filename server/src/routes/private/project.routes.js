import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { addProject } from "../../controllers/private/project.controller.js";

const projectRouter = Router();

projectRouter.route("/add").post(verifyJWT, addProject);

projectRouter.route("/:projectId/update").patch(verifyJWT, addProject);

projectRouter.route("/:projectId/delete").delete(verifyJWT, addProject);

export default projectRouter;
