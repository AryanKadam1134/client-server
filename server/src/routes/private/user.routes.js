import { Router } from "express";

import {
  deleteUser,
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

userRouter.use(verifyJWT);

userRouter.route("/check-password").get(hasPassowrd);

userRouter
  .route("/")
  .get(getUserDetails)
  .patch(updateUserDetails)
  .delete(deleteUser);

userRouter
  .route("/image")
  .patch(upload.single("image"), updateUserImage)
  .delete(deleteUserImage);

userRouter
  .route("/resume")
  .patch(upload.single("resumeOrCv"), updateUserResume)
  .delete(deleteUserResume);

export default userRouter;
