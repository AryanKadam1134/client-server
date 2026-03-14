import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addEducation,
  updateEducationDetails,
} from "../../controllers/private/education.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const educationRouter = Router();

educationRouter
  .route("/add")
  .post(verifyJWT, upload.single("instituteImage"), addEducation);

educationRouter
  .route("/:educationId/update")
  .patch(verifyJWT, upload.single("instituteImage"), updateEducationDetails);

export default educationRouter;
