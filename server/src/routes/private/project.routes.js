import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addProject,
  deleteProject,
  deleteProjectCoverImage,
  deleteProjectImages,
  updateProjectCoverImage,
  updateProjectDetails,
  updateProjectImages,
} from "../../controllers/private/project.controller.js";
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

projectRouter
  .route("/:projectId/update-details")
  .patch(verifyJWT, updateProjectDetails);

projectRouter
  .route("/:projectId/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateProjectCoverImage);

projectRouter
  .route("/:projectId/update-projectImages")
  .patch(verifyJWT, upload.array("projectImages", 5), updateProjectImages);

projectRouter.route("/:projectId/delete").delete(verifyJWT, deleteProject);

projectRouter
  .route("/:projectId/delete-coverImage")
  .delete(verifyJWT, deleteProjectCoverImage);

projectRouter
  .route("/:projectId/delete-projectImages/:imagePublicId")
  .patch(verifyJWT, deleteProjectImages);

export default projectRouter;
