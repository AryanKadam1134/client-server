import mongoose from "mongoose";

import { SkillCategory } from "../../models/skillCategory.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import asynchandler from "../../utils/asynchandler.js";

const addSkillCategory = asynchandler(async (req, res) => {
  const { name, visibility, sortOrder } = req.body;

  if (!name) {
    throw new ApiError(400, "name is required!");
  }

  const category = await SkillCategory.findOne({
    owner: req.user?._id,
    name,
  });

  if (category) {
    throw new ApiError(409, "category name already exists!");
  }

  const fields = {};

  fields.name = name;

  if (typeof visibility == "boolean") fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const newCategory = await SkillCategory.create({
    owner: req.user?._id,
    ...fields,
  });

  return res
    .status(201)
    .json(new ApiRes(201, newCategory, "category created successfully!"));
});

const updateSkillCategory = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { name, visibility, sortOrder } = req.body;

  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(404, "categoryId is required!");
  }

  const categoryExists = await SkillCategory.findById(categoryId);

  if (!categoryExists) {
    throw new ApiError(404, "category not found!");
  }

  if (categoryExists.owner.toString() !== loggedUserId) {
    throw new ApiError(403, "unauthorized!");
  }

  const sameCategoryName = await SkillCategory.findOne({
    owner: loggedUserId,
    name,
  });

  if (sameCategoryName) {
    throw new ApiError(409, "category name already exists!");
  }

  const fields = {};

  if (name) fields.name = name;
  if (typeof visibility == "boolean") fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const updatedCategory = await SkillCategory.findByIdAndUpdate(
    categoryId,
    {
      $set: fields,
    },
    { new: true },
  );

  if (!updatedCategory) {
    throw new ApiError(500, "couldn't updated category!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedCategory, "category updated successfully!"));
});

const deleteSkillCategory = asynchandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(404, "categoryId is required!");
  }

  const deleteCategory = await SkillCategory.findOneAndDelete({
    owner: req.user?._id,
    _id: categoryId,
  });

  if (!deleteCategory) {
    throw new ApiError(404, "category not found!");
  }

  return res
    .status(204)
    .json(new ApiRes(204, null, "category deleted successfully!"));
});

const getAllCategoryWiseSkills = asynchandler(async (req, res) => {
  const categories = await SkillCategory.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "_id",
        foreignField: "categoryId",
        as: "skills",
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ]);

  if (categories?.length <= 0) {
    throw new ApiError(404, "categories not found!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, categories, "categories fetched successfully!"));
});

export {
  addSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  getAllCategoryWiseSkills,
};
