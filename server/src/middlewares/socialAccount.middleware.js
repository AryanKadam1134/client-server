import { SocialAccount } from "../models/socialAccount.model.js";

import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";

export const getSocialAccountById = asynchandler(async (req, res, next) => {
  const { accountId } = req.params;

  if (!accountId) {
    throw new ApiError(400, "accountId is required!");
  }

  const accountExists = await SocialAccount.findById(accountId);

  if (!accountExists) {
    throw new ApiError(404, "account not found!");
  }

  if (accountExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "unauthorized!");
  }

  req.socialAccount = accountExists;

  next();
});
