import mongoose from "mongoose";
import { Skill } from "../../models/skill.model.js";
import { SocialAccount } from "../../models/socialAccount.model.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import ApiError from "../../utils/ApiError.js";
import { SkillCategory } from "../../models/skillCategory.model.js";
import { Project } from "../../models/project.model.js";
import { Experience } from "../../models/experience.model.js";

const getUserByUsername = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.user, "user data fetched successfully!"));
});

const getUserSocialAccounts = asynchandler(async (req, res) => {
  const platforms = await SocialAccount.find({
    owner: req.user?._id,
    visibility: true,
  })
    .sort({ sortOrder: 1 })
    .lean();

  return res
    .status(200)
    .json(new ApiRes(200, platforms, "Platforms fetched successfully!"));
});

const getSkillWithCategory = asynchandler(async (req, res) => {
  const skills = await Skill.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
        visibility: true,
      },
    },
    {
      $lookup: {
        from: "skillcategories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $addFields: {
        category: {
          $first: "$category",
        },
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ]);

  if (!skills) {
    throw new ApiError(500, "couldn't get all skills!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, skills, "skills fetched successfully!"));
});

const getCategoryWiseSkills = asynchandler(async (req, res) => {
  const categories = await SkillCategory.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
        visibility: true,
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "_id",
        foreignField: "categoryId",
        as: "skills",
        pipeline: [
          {
            $match: {
              visibility: true,
            },
          },
        ],
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ]);

  if (!categories) {
    throw new ApiError(500, "couldn't get categories!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, categories, "categories fetched successfully!"));
});

const getProjects = asynchandler(async (req, res) => {
  const projects = await Project.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
        visibility: true,
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "techStack",
        foreignField: "_id",
        as: "techStack",
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ]);

  if (!projects) {
    throw new ApiError(500, "couldn't get projects!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, projects, "projects fetched successfully!"));
});

const getExperiences = asynchandler(async (req, res) => {
  const { onlyFeatured } = req.query;

  const fields = {
    owner: new mongoose.Types.ObjectId(req.user?._id),
    visibility: true,
  };

  if (onlyFeatured === "true") fields.featured = true;

  const experiences = await Experience.aggregate([
    {
      $match: fields,
    },
    {
      $lookup: {
        from: "skills",
        localField: "techStack",
        foreignField: "_id",
        as: "techStack",
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ]);

  if (!experiences) {
    throw new ApiError(500, "couldn't get experiences!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, experiences, "experiences fetched successfully!"));
});

export {
  getUserByUsername,
  getUserSocialAccounts,
  getSkillWithCategory,
  getCategoryWiseSkills,
  getProjects,
  getExperiences,
};
