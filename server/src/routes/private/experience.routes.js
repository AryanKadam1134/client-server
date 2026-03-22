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

experienceRouter.use(verifyJWT);

experienceRouter
  .route("/")
  .post(upload.single("organizationImage"), addExperience)
  .get(getAllExperiences);

experienceRouter
  .route("/:experienceId")
  .patch(updateExperience)
  .delete(deleteExperience);

experienceRouter
  .route("/:experienceId/organization-image")
  .patch(upload.single("organizationImage"), updateOrganizationImage)
  .delete(deleteOrganiaztionImage);

export default experienceRouter;
