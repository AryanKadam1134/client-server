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
  .route("/")
  .post(verifyJWT, upload.single("organizationImage"), addExperience);

experienceRouter.route("/:experienceId").patch(verifyJWT, updateExperience);

experienceRouter
  .route("/:experienceId/organization-image")
  .patch(
    verifyJWT,
    upload.single("organizationImage"),
    updateOrganizationImage,
  );

experienceRouter.route("/:experienceId").delete(verifyJWT, deleteExperience);

experienceRouter
  .route("/:experienceId/organization-image")
  .delete(verifyJWT, deleteOrganiaztionImage);

experienceRouter.route("/").get(verifyJWT, getAllExperiences);

export default experienceRouter;
