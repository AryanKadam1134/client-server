import { SocialAccount } from "../../models/socialAccount.model.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";

const getUserByUsername = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.user, "user data fetched successfully!"));
});

const getUserSocialAccounts = asynchandler(async (req, res) => {
  const platforms = await SocialAccount.find({
    owner: req.user?._id,
    visibility: true,
  })
    .sort({ sortOrder: 1 })
    .lean();

  return res
    .status(200)
    .json(new ApiRes(200, platforms, "Platforms fetched successfully!"));
});

export { getUserByUsername, getUserSocialAccounts };
