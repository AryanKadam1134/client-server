import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";

import { User } from "../models/user.model.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(400, "access token missing!");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select(
    "-password -sessions",
  );

  if (!user) {
    throw new ApiError(404, "user does not exists!");
  }

  req.user = user;

  next();
});
