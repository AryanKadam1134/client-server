import { SocialAccount } from "../../models/socialAccount.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import asynchandler from "../../utils/asynchandler.js";

const manageSocialPlatforms = asynchandler(async (req, res) => {
  const { platforms } = req.body;
  const userId = req.user._id;

  if (!Array.isArray(platforms) || platforms.length === 0) {
    throw new ApiError(400, "No platforms provided!");
  }

  const operations = platforms.map((platform, index) => {
    // ✅ EXISTING PLATFORM → UPDATE
    if (platform._id) {
      return {
        updateOne: {
          filter: {
            _id: platform._id,
            owner: userId,
          },
          update: {
            $set: {
              name: platform.name,
              link: platform.link,
              visibility: platform.visibility,
              sortOrder: platform.sortOrder ?? index,
            },
          },
        },
      };
    }

    // ✅ NEW PLATFORM → INSERT
    return {
      insertOne: {
        document: {
          owner: userId,
          name: platform.name,
          link: platform.link,
          visibility: platform.visibility,
          sortOrder: platform.sortOrder ?? index,
        },
      },
    };
  });

  const result = await SocialAccount.bulkWrite(operations);

  return res
    .status(200)
    .json(new ApiRes(200, result, "Platforms managed successfully!"));
});

const deleteSocialAccount = asynchandler(async (req, res) => {
  const { accountId } = req.params;

  const deleted = await SocialAccount.findByIdAndDelete(accountId);

  console.log("Deleted Social Platfrom: ", accountId);
  if (!deleted) {
    throw new ApiError(500, "couldn't delete social platform!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "social account deleted successfully!"));
});

const getAllUserSocialPlatforms = asynchandler(async (req, res) => {
  const platforms = await SocialAccount.find({
    owner: req.user?._id,
  }).sort({ sortOrder: 1 });

  if (platforms?.length <= 0) {
    return res.status(200).json(new ApiRes(200, [], "no platforms found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, platforms, "platforms fetched successfully!"));
});

export {
  manageSocialPlatforms,
  getAllUserSocialPlatforms,
  deleteSocialAccount,
};
