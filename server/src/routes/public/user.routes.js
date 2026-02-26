import { Router } from "express";

import { getUserByUsername } from "../../controllers/user.controller.js";

const publicUserRouter = Router();

publicUserRouter.route("/:username").get(getUserByUsername);

export default publicUserRouter;
