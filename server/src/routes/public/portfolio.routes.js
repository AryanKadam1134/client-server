import { Router } from "express";

import { getUserByUsername } from "../../controllers/user.controller.js";

const portfolioRouter = Router();

portfolioRouter.route("/:username").get(getUserByUsername);

export default portfolioRouter;
