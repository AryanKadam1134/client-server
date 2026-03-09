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

const experienceRouter = Router();

experienceRouter.route("/add").post(verifyJWT, addExperience);

experienceRouter
  .route("/:organizationId/update-details")
  .patch(verifyJWT, updateExperience);

experienceRouter
  .route("/:organizationId/update-organizationImage")
  .patch(verifyJWT, updateOrganizationImage);

experienceRouter
  .route("/:organizationId/delete")
  .delete(verifyJWT, deleteExperience);

experienceRouter
  .route("/:organizationId/delete-organizationImage")
  .delete(verifyJWT, deleteOrganiaztionImage);

experienceRouter.route("/all").get(verifyJWT, getAllExperiences);

export default experienceRouter;
