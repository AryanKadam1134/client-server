import { Router } from "express";
import { getJokes } from "../controllers/app.controller.js";

const appRoutes = Router();

appRoutes.route("/jokes").get(getJokes);

export default appRoutes;
