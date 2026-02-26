import { Router } from "express";
import {
  getSkillLevel,
  getSocialPlatforms,
} from "../../controllers/filter.controller.js";

const privateFilterRoutes = Router();

privateFilterRoutes.route("/social-platforms").get(getSocialPlatforms);

privateFilterRoutes.route("/skill-levels").get(getSkillLevel);

export default privateFilterRoutes;
