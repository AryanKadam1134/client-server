import { Router } from "express";
import {
  addExperience,
  deleteExperience,
  deleteOrganiaztionImage,
  getAllExperiences,
  updateExperience,
  updateOrganizationImage,
} from "../../controllers/private/experience.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const experienceRouter = Router();

experienceRouter
  .route("/add")
  .post(verifyJWT, upload.single("organizationImage"), addExperience);

experienceRouter
  .route("/:experienceId/update-details")
  .patch(verifyJWT, updateExperience);

experienceRouter
  .route("/:experienceId/update-organizationImage")
  .patch(
    verifyJWT,
    upload.single("organizationImage"),
    updateOrganizationImage,
  );

experienceRouter
  .route("/:experienceId/delete")
  .delete(verifyJWT, deleteExperience);

experienceRouter
  .route("/:experienceId/delete-organizationImage")
  .delete(verifyJWT, deleteOrganiaztionImage);

experienceRouter.route("/all").get(verifyJWT, getAllExperiences);

export default experienceRouter;
