import { Router } from "express";

import {
  changePassword,
  deleteUserImage,
  deleteUserResume,
  getUserDetails,
  hasPassowrd,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserDetails,
  updateUserImage,
  updateUserResume,
} from "../../controllers/private/user.controller.js";

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

userRouter.route("/check-password").get(verifyJWT, hasPassowrd);

userRouter.route("/password").patch(verifyJWT, changePassword);

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

userRouter.route("/restoreSession").post(refreshAccessToken);

export default userRouter;
