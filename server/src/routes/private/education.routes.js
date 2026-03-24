import { Router } from "express";

import {
  addEducation,
  deleteEducation,
  deleteInstituteImage,
  getAllEducations,
  updateEducationDetails,
  updateInstituteImage,
} from "../../controllers/private/education.controller.js";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const educationRouter = Router();

educationRouter.use(verifyJWT);

educationRouter
  .route("/")
  .post(upload.single("instituteImage"), addEducation)
  .get(getAllEducations);

educationRouter
  .route("/:educationId")
  .patch(updateEducationDetails)
  .delete(deleteEducation);

educationRouter
  .route("/:educationId/institute-image")
  .patch(upload.single("instituteImage"), updateInstituteImage)
  .delete(deleteInstituteImage);

export default educationRouter;
