import { Router } from "express";

import { loginUser, registerUser } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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

userRouter.route("/logout").post(verifyJWT, loginUser);

export default userRouter;
