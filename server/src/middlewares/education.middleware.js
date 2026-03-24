import { Education } from "../models/education.model.js";

import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";

export const getEducationById = asynchandler(async (req, res, next) => {
  const { educationId } = req.params;

  if (!educationId) {
    throw new ApiError(400, "educationId is required!");
  }

  const educationExists = await Education.findById(educationId);

  if (!educationExists) {
    throw new ApiError(404, "skill not found!");
  }

  if (educationExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "unauthorized!");
  }

  req.education = educationExists;

  next();
});
