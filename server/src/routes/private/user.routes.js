import { Router } from "express";

import {
  deleteUserImage,
  deleteUserResume,
  getUserDetails,
  hasPassowrd,
  updateUserDetails,
  updateUserImage,
  updateUserResume,
} from "../../controllers/private/user.controller.js";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/check-password").get(verifyJWT, hasPassowrd);

userRouter
  .route("/")
  .get(verifyJWT, getUserDetails)
  .patch(verifyJWT, updateUserDetails);

userRouter
  .route("/image")
  .patch(verifyJWT, upload.single("image"), updateUserImage)
  .delete(verifyJWT, deleteUserImage);

userRouter
  .route("/resume")
  .patch(verifyJWT, upload.single("resumeOrCv"), updateUserResume)
  .delete(verifyJWT, deleteUserResume);

export default userRouter;
