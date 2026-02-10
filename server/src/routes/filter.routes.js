import { Router } from "express";
import {
  getSkillLevel,
  getSocialPlatforms,
} from "../controllers/filter.controller.js";

const filterRoutes = Router();

filterRoutes.route("/social-platforms").get(getSocialPlatforms);

filterRoutes.route("/skill-levels").get(getSkillLevel);

export default filterRoutes;
