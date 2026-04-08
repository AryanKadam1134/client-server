import {
  SKILL_LEVEL,
  SOCIAL_PLATFORMS,
  GENDERS,
  EMPLOYMENT_TYPE,
  VISIBILITY,
} from "../../constants.js";
import { SkillCategory } from "../../models/skillCategory.model.js";
import ApiError from "../../utils/ApiError.js";

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

const getSkillCategories = asynchandler(async (req, res) => {
  const categories = await SkillCategory.find({
    owner: req.user?._id,
  });

  if (categories?.length === 0) {
    return res.status(200).json(new ApiRes(200, [], "no categories found!"));
  }

  const formatted = categories?.map((category) => ({
    label: category?.name,
    value: category?._id,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, formatted, "categories fetched successfully!"));
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
  getSkillCategories,
  getSkillLevel,
  getGenders,
  getEmploymentTypes,
  getVisibility,
};
