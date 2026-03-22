import { SkillCategory } from "../models/skillCategory.model";

import ApiError from "../utils/ApiError";
import asynchandler from "../utils/asynchandler";

export const getCategoryById = asynchandler(async (req, res, next) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(400, "categoryId is required!");
  }

  const categoryExists = await SkillCategory.findById(categoryId);

  if (!categoryExists) {
    throw new ApiError(404, "category not found!");
  }

  if (categoryExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "unauthorized!");
  }

  req.category = categoryExists;

  next();
});
