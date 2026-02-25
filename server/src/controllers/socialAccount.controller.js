import { SocialAccount } from "../models/socialAccount.model";
import ApiError from "../utils/ApiError";
import ApiRes from "../utils/ApiRes";
import asynchandler from "../utils/asynchandler";

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

export { addSocialPlatforms };
