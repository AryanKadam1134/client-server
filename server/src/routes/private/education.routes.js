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
  .route("/add")
  .post(verifyJWT, upload.single("instituteImage"), addEducation);

educationRouter
  .route("/:educationId/update")
  .patch(verifyJWT, updateEducationDetails);

educationRouter
  .route("/:educationId/update-instituteImage")
  .patch(verifyJWT, upload.single("instituteImage"), updateInstituteImage);

educationRouter
  .route("/:educationId/delete")
  .delete(verifyJWT, deleteEducation);

educationRouter
  .route("/:educationId/delete-instituteImage")
  .delete(verifyJWT, deleteInstituteImage);

educationRouter.route("/all").get(verifyJWT, getAllEducations);

export default educationRouter;
