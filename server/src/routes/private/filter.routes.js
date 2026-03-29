import { Router } from "express";

import {
  getEmploymentTypes,
  getGenders,
  getSkillLevel,
  getSocialPlatforms,
  getVisibility,
} from "../../controllers/private/filter.controller.js";

const filterRoutes = Router();

filterRoutes.route("/social-platforms").get(getSocialPlatforms);

filterRoutes.route("/skill-levels").get(getSkillLevel);

filterRoutes.route("/genders").get(getGenders);

filterRoutes.route("/employment-types").get(getEmploymentTypes);

filterRoutes.route("/visibility").get(getVisibility);

export default filterRoutes;
