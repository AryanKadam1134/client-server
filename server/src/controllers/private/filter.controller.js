import {
  SKILL_LEVEL,
  SOCIAL_PLATFORMS,
  GENDERS,
  EMPLOYMENT_TYPE,
  VISIBILITY,
} from "../../constants.js";
import { Experience } from "../../models/experience.model.js";
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

const getAllOrganizations = asynchandler(async (req, res) => {
  const organizations = await Experience.find({
    owner: req.user?._id,
  });

  if (organizations?.length === 0) {
    return res.status(200).json(new ApiRes(200, [], "no organizations found!"));
  }

  const formatted = organizations?.map((category) => ({
    label: category?.organization,
    value: category?._id,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, formatted, "organizations fetched successfully!"));
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
  getAllOrganizations,
  getSkillLevel,
  getGenders,
  getEmploymentTypes,
  getVisibility,
};
