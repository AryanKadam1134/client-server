import mongoose from "mongoose";
import { Skill } from "../../models/skill.model.js";
import { SocialAccount } from "../../models/socialAccount.model.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import ApiError from "../../utils/ApiError.js";

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
  ]);

  if (!skills) {
    throw new ApiError(500, "couldn't get all skills!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, skills, "skills fetched successfully!"));
});

export { getUserByUsername, getUserSocialAccounts, getSkillWithCategory };
