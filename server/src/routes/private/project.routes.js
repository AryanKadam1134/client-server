import { Router } from "express";

import {
  addProject,
  deleteProject,
  deleteProjectCoverImage,
  deleteProjectImage,
  getAllProjects,
  updateProjectCoverImage,
  updateProjectDetails,
  updateProjectImages,
} from "../../controllers/private/project.controller.js";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getProjectById } from "../../middlewares/project.middleware.js";

const projectRouter = Router();

projectRouter.route("/").post(
  verifyJWT,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "projectImages", maxCount: 5 },
  ]),
  addProject,
);

projectRouter
  .route("/:projectId")
  .patch(verifyJWT, getProjectById, updateProjectDetails);

projectRouter
  .route("/:projectId/cover-image")
  .patch(
    verifyJWT,
    getProjectById,
    upload.single("coverImage"),
    updateProjectCoverImage,
  );

projectRouter
  .route("/:projectId/project-images")
  .patch(
    verifyJWT,
    getProjectById,
    upload.array("projectImages", 5),
    updateProjectImages,
  );

projectRouter
  .route("/:projectId/")
  .delete(verifyJWT, getProjectById, deleteProject);

projectRouter
  .route("/:projectId/cover-image")
  .delete(verifyJWT, getProjectById, deleteProjectCoverImage);

projectRouter
  .route("/:projectId/project-images/:imagePublicId")
  .delete(verifyJWT, getProjectById, deleteProjectImage);

projectRouter.route("/").get(verifyJWT, getAllProjects);

export default projectRouter;
