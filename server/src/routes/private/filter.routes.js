import { Router } from "express";
import {
  getSkillLevel,
  getSocialPlatforms,
} from "../../controllers/private/filter.controller.js";

const filterRoutes = Router();

filterRoutes.route("/social-platforms").get(getSocialPlatforms);

filterRoutes.route("/skill-levels").get(getSkillLevel);

export default filterRoutes;
