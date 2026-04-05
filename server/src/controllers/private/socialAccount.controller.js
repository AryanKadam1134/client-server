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

const addSocialAccount = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { name, link, visibility, sortOrder } = req.body;

  if (!name) {
    throw new ApiError(400, "name is required!");
  }

  if (!link) {
    throw new ApiError(400, "link is required!");
  }

  const accountExists = await SocialAccount.findOne({
    owner: loggedUserId,
    name,
  });

  if (accountExists) {
    throw new ApiError(409, "account name already exists!");
  }

  const fields = {};

  fields.name = name;
  fields.link = link;
  if (visibility) fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const newSocialAccount = await SocialAccount.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(201)
    .json(
      new ApiRes(201, newSocialAccount, "social account created successfully!"),
    );
});

const updateSocialAccount = asynchandler(async (req, res) => {
  const socialAccount = req.socialAccount;

  const { name, link, visibility, sortOrder } = req.body;

  if (name) {
    const sameAccountName = await SocialAccount.findOne({
      _id: { $ne: socialAccount._id },
      owner: socialAccount?.owner,
      name,
    });

    if (sameAccountName) {
      throw new ApiError(409, "social account name already exists!");
    }
  }

  const fields = {};

  if (name) fields.name = name;
  if (link) fields.link = link;
  if (visibility) fields.visibility = visibility;
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  if (Object.keys(fields).length === 0) {
    throw new ApiError(400, "no fields provided to update!");
  }

  const updatedSocialAccount = await SocialAccount.findByIdAndUpdate(
    socialAccount._id,
    {
      $set: fields,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        updatedSocialAccount,
        "social account updated successfully!",
      ),
    );
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
  addSocialAccount,
  updateSocialAccount,
  deleteSocialAccount,
  getAllUserSocialPlatforms,
};
