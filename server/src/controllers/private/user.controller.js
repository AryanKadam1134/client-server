import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import {
  accessTokenOptions,
  options,
  refreshTokenOptions,
} from "../../constants.js";

import { User } from "../../models/user.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import sendEmail from "../../utils/mailShooter.js";
import asynchandler from "../../utils/asynchandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import passwordChangedTemplate from "../../utils/emailTemplates/passwordChanged.js";

const hasPassowrd = asynchandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user?.password && user?.googleId) {
    return res.status(200).json(new ApiRes(200, false, ""));
  } else {
    return res.status(200).json(new ApiRes(200, true, ""));
  }
});

const updateUserDetails = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    username,
    firstName,
    middleName,
    lastName,
    headline,
    about,
    mobileNo,
    gender,
    location,
    documentUrl,
  } = req.body;

  const fields = {};

  if (username) fields.username = username;
  if (firstName) fields.firstName = firstName;
  if (middleName) fields.middleName = middleName;
  if (lastName) fields.lastName = lastName;
  if (headline) fields.headline = headline;
  if (about) fields.about = about;
  if (gender) fields.gender = gender;
  if (location) {
    for (const key in location) {
      fields[`location.${key}`] = location[key];
    }
  }

  // Can be null values
  if (mobileNo !== undefined) fields.mobileNo = mobileNo;
  if (documentUrl !== undefined) fields.documentUrl = documentUrl;

  if (Object.keys(fields).length === 0) {
    throw new ApiError(400, "no fields provided to update!");
  }

  // Check if user exists if username or email is provided
  if (username) {
    const userExists = await User.findOne({
      username,
      _id: { $ne: loggedUserId },
    });

    if (userExists) {
      throw new ApiError(
        409,
        "user already exists with similar username or email",
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    loggedUserId,
    {
      $set: fields,
    },
    { new: true },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "user details updated successfully!"));
});

const getUserDetails = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.user, "user details fetched successfully!"));
});

const updateUserImage = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  const loggedUserId = loggedUser?._id;

  const userImageLocalPath = req.file?.path;

  if (!userImageLocalPath) {
    throw new ApiError(400, "missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(userImageLocalPath);

  if (!updatedImage?.secure_url) {
    throw new ApiError(500, "error while updating image on cloudinary!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    loggedUserId,
    {
      $set: {
        image: {
          url: updatedImage?.secure_url,
          public_id: updatedImage?.public_id,
          resource_type: updatedImage?.resource_type,
        },
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  if (loggedUser?.image?.public_id) {
    try {
      await deleteFromCloudinary(loggedUser.image);
    } catch (error) {
      console.error("Error deleting user image in updateUserImage: ", error);
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "user image updated successfully!"));
});

const updateUserResume = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  const loggedUserId = loggedUser?._id;

  const userResumeLocalPath = req.file?.path;

  if (!userResumeLocalPath) {
    throw new ApiError(400, "missing resumeOrCv file path!");
  }

  const updatedResume = await uploadToCloudinary(userResumeLocalPath);

  if (!updatedResume?.secure_url) {
    throw new ApiError(500, "error while updating resume on cloudinary!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    loggedUserId,
    {
      $set: {
        resumeOrCv: {
          url: updatedResume?.secure_url,
          public_id: updatedResume?.public_id,
          resource_type: updatedResume?.resource_type,
        },
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  if (loggedUser?.resumeOrCv?.public_id) {
    try {
      await deleteFromCloudinary(loggedUser.resumeOrCv);
    } catch (error) {
      console.error("Error deleting user resume in updateUserResume: ", error);
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "user resume updated successfully!"));
});

const deleteUserImage = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  const updatedUser = await User.findByIdAndUpdate(
    loggedUser?._id,
    {
      $unset: {
        image: "",
      },
    },
    { new: true },
  );

  if (loggedUser?.image?.public_id) {
    try {
      await deleteFromCloudinary(loggedUser.image);
    } catch (error) {
      console.error("Error deleting user image in deleteUserImage: ", error);
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "image deleted successfully!"));
});

const deleteUserResume = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  const updatedUser = await User.findByIdAndUpdate(
    loggedUser?._id,
    {
      $unset: {
        resumeOrCv: "",
      },
    },
    { new: true },
  );

  if (loggedUser?.resumeOrCv?.public_id) {
    try {
      await deleteFromCloudinary(loggedUser.resumeOrCv);
    } catch (error) {
      console.error("Error deleting user resume in deleteUserResume: ", error);
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "resumeOrCv deleted successfully!"));
});

export {
  hasPassowrd,
  updateUserDetails,
  getUserDetails,
  updateUserImage,
  updateUserResume,
  deleteUserImage,
  deleteUserResume,
};
