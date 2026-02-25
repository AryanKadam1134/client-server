import { SocialAccount } from "../models/socialAccount.model.js";
import ApiError from "../utils/ApiError.js";
import ApiRes from "../utils/ApiRes.js";
import asynchandler from "../utils/asynchandler.js";

const addSocialPlatforms = asynchandler(async (req, res) => {
  const { platforms } = req.body;

  if (!Array.isArray(platforms) || platforms?.length == 0) {
    throw new ApiError(400, "invalid platforms data!");
  }

  const createdPlatforms = await SocialAccount.insertMany(
    platforms?.map((platform, index) => ({
      owner: req.user?._id,
      ...platform,
      sortOrder: platform?.sortOrder ?? index,
    })),
  );

  return res
    .status(200)
    .json(new ApiRes(200, createdPlatforms, "Platforms added successfully!"));
});

const getUserSocialAccounts = asynchandler(async (req, res) => {
  const platforms = await SocialAccount.find({
    owner: req.user?._id,
    visibility: true,
  });

  return res
    .status(200)
    .json(new ApiRes(200, platforms, "Platforms fetched successfully!"));
});

export { addSocialPlatforms, getUserSocialAccounts };
