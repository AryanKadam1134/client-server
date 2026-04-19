import { Router } from "express";
import { googleAuth } from "../../controllers/private/user.controller";

const authRouter = Router();

authRouter.route("/auth/google").post(googleAuth);

export default authRouter;
