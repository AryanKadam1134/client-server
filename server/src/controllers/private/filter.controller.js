import {
  SKILL_LEVEL,
  SOCIAL_PLATFORMS,
  GENDERS,
  EMPLOYMENT_TYPE,
  VISIBILITY,
} from "../../constants.js";

import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";

const getSocialPlatforms = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        SOCIAL_PLATFORMS,
        "socail platforms fetched successfully!",
      ),
    );
});

const getSkillLevel = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, SKILL_LEVEL, "skill levels fetched successfully!"));
});

const getGenders = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, GENDERS, "genders fetched successfully!"));
});

const getEmploymentTypes = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        EMPLOYMENT_TYPE,
        "employment types fetched successfully!",
      ),
    );
});

const getVisibility = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, VISIBILITY, "visibility fetched successfully!"));
});

export {
  getSocialPlatforms,
  getSkillLevel,
  getGenders,
  getEmploymentTypes,
  getVisibility,
};
