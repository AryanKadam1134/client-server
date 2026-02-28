import { Router } from "express";

import {
  changePassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserDetails,
  updateUserImage,
  updateUserResume,
} from "../../controllers/user.controller.js";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "resumeOrCv",
      maxCount: 1,
    },
  ]),
  registerUser,
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/change-password").post(verifyJWT, changePassword);

userRouter.route("/update").patch(verifyJWT, updateUserDetails);

userRouter
  .route("/update-image")
  .patch(verifyJWT, upload.single("image"), updateUserImage);

userRouter
  .route("/update-resume")
  .patch(verifyJWT, upload.single("resumeOrCv"), updateUserResume);

userRouter.route("/restoreSession").post(verifyJWT, refreshAccessToken);

export default userRouter;
