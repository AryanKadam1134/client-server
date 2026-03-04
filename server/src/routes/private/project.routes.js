import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { addProject } from "../../controllers/private/project.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const projectRouter = Router();

projectRouter.route("/add").post(
  verifyJWT,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "projectImages", maxCount: 5 },
  ]),
  addProject,
);

projectRouter.route("/:projectId/update").patch(verifyJWT, addProject);

projectRouter.route("/:projectId/delete").delete(verifyJWT, addProject);

export default projectRouter;
