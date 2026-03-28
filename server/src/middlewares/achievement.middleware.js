import { Achievement } from "../models/achievement.model.js";

import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";

export const getAchievementById = asynchandler(async (req, res, next) => {
  const { achievementId } = req.params;

  if (!achievementId) {
    throw new ApiError(400, "achievementId is required!");
  }

  const achievementExists = await Achievement.findById(achievementId);

  if (!achievementExists) {
    throw new ApiError(404, "achievement not found!");
  }

  if (achievementExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "unauthorized!");
  }

  req.achievement = achievementExists;

  next();
});
