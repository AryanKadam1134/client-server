import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  addEducation,
  deleteEducation,
  deleteInstituteImage,
  getAllEducations,
  updateEducationDetails,
  updateInstituteImage,
} from "../../controllers/private/education.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const educationRouter = Router();

educationRouter
  .route("/")
  .post(verifyJWT, upload.single("instituteImage"), addEducation);

educationRouter.route("/:educationId").patch(verifyJWT, updateEducationDetails);

educationRouter
  .route("/:educationId/institute-image")
  .patch(verifyJWT, upload.single("instituteImage"), updateInstituteImage);

educationRouter.route("/:educationId").delete(verifyJWT, deleteEducation);

educationRouter
  .route("/:educationId/institute-image")
  .delete(verifyJWT, deleteInstituteImage);

educationRouter.route("/").get(verifyJWT, getAllEducations);

export default educationRouter;
