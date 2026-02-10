import { SKILL_LEVEL, SOCIAL_PLATFORMS } from "../constants.js";
import ApiRes from "../utils/ApiRes.js";
import asynchandler from "../utils/asynchandler.js";

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

export { getSocialPlatforms, getSkillLevel };
