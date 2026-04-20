import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";

export const findUserByUsername = asynchandler(async (req, res, next) => {
  const user = await User.findOne({
    username: req.params?.username,
  }).select("-password -sessions");

  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  req.user = user;

  next();
});
