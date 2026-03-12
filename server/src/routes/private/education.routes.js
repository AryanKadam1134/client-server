import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { addEducation } from "../../controllers/private/education.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const educationRouter = Router();

educationRouter
  .route("/add")
  .post(verifyJWT, upload.single("instituteImage"), addEducation);

export default educationRouter;
