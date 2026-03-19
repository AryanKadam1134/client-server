import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addProject,
  deleteProject,
  deleteProjectCoverImage,
  deleteProjectImages,
  getAllProjects,
  updateProjectCoverImage,
  updateProjectDetails,
  updateProjectImages,
} from "../../controllers/private/project.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const projectRouter = Router();

projectRouter.route("/").post(
  verifyJWT,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "projectImages", maxCount: 5 },
  ]),
  addProject,
);

projectRouter.route("/:projectId").patch(verifyJWT, updateProjectDetails);

projectRouter
  .route("/:projectId/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateProjectCoverImage);

projectRouter
  .route("/:projectId/project-images")
  .patch(verifyJWT, upload.array("projectImages", 5), updateProjectImages);

projectRouter.route("/:projectId/").delete(verifyJWT, deleteProject);

projectRouter
  .route("/:projectId/cover-image")
  .delete(verifyJWT, deleteProjectCoverImage);

projectRouter
  .route("/:projectId/project-images/:imagePublicId")
  .delete(verifyJWT, deleteProjectImages);

projectRouter.route("/").get(verifyJWT, getAllProjects);

export default projectRouter;
