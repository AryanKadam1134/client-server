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

const privateUserRouter = Router();

privateUserRouter.route("/register").post(
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

privateUserRouter.route("/login").post(loginUser);

privateUserRouter.route("/logout").post(verifyJWT, logoutUser);

privateUserRouter.route("/change-password").post(verifyJWT, changePassword);

privateUserRouter.route("/update").patch(verifyJWT, updateUserDetails);

privateUserRouter
  .route("/update-image")
  .patch(verifyJWT, upload.single("image"), updateUserImage);

privateUserRouter
  .route("/update-resume")
  .patch(verifyJWT, upload.single("resumeOrCv"), updateUserResume);

privateUserRouter.route("/restoreSession").post(verifyJWT, refreshAccessToken);

export default privateUserRouter;
