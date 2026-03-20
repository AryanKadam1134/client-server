import jwt from "jsonwebtoken";

import { options } from "../../constants.js";

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

const generateAccessAndRefreshToken = async (userId) => {
  if (!userId) return;

  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log("accessToken: ", accessToken);
    // console.log("refreshToken: ", refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error Generating Access or Refresh Token: ", error);
    throw new ApiError(501, "Couldn't generate Refresh token and Access token");
  }
};

const refreshAccessToken = asynchandler(async (req, res) => {
  const cookieRefreshToken = req.cookies?.refreshToken;

  const decodedToken = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const loggedUser = await User.findById(decodedToken?._id);

  if (!loggedUser) {
    throw new ApiError(404, "user not found!");
  }

  // console.log("storedToken: ", loggedUser?.refreshToken);
  // console.log("cookieRefreshToken: ", cookieRefreshToken);

  if (loggedUser?.refreshToken !== cookieRefreshToken) {
    throw new ApiError(419, "session expired!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    loggedUser?._id,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "couldn't generate access or refresh token!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRes(
        200,
        { accessToken, refreshToken },
        "session revived successfully!",
      ),
    );
});

const registerUser = asynchandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some(
      (field) => typeof field == "string" && field?.trim() == "",
    )
  ) {
    throw new ApiError(400, "all fields are required!");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new ApiError(
      409,
      "user already exist with similar username or email!",
    );
  }

  const createdUser = await User.create({
    fullName,
    username: username?.toLowerCase(),
    email,
    password,
  });

  if (!createdUser?._id) {
    throw new ApiError(500, "couldn't create an user!");
  }

  return res
    .status(201)
    .json(new ApiRes(201, createdUser, "user created successfully!"));
});

const loginUser = asynchandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "username and password is required!");
  }

  const userExist = await User.findOne({
    username,
  });

  if (!userExist) {
    throw new ApiError(404, "user does not exists!");
  }

  const isPasswordCorrect = await userExist.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "invalid password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userExist?._id,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "couldn't generate access or refresh token!");
  }

  const loggedUser = await User.findById(userExist?._id).select(
    "-password -refreshToken",
  );

  if (!loggedUser) {
    throw new ApiError(500, "error logging in user!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRes(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "user logged in successfully!",
      ),
    );
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id, {
    $set: { refreshToken: undefined },
  });

  return res
    .status(204)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiRes(204, "user logged out successfully!"));
});

const changePassword = asynchandler(async (req, res) => {
  const { old_password, new_password } = req.body;

  // console.log("old_password: ", old_password);
  // console.log("new_password: ", new_password);

  if (!old_password || !new_password) {
    throw new ApiError(400, "all fields are required!");
  }

  const loggedUser = await User.findById(req.user?._id);

  const isPasswordCorrect = await loggedUser.isPasswordCorrect(old_password);

  if (!isPasswordCorrect) {
    throw new ApiError(409, "invalid password!");
  }

  if (new_password === old_password) {
    throw new ApiError(409, "new password connot be same as old password!");
  }

  loggedUser.password = new_password;

  await loggedUser.save({ validateBeforeSave: false });

  await sendEmail({
    to: loggedUser.email,
    subject: "Your Password Was Changed Successfully 🔐",
    html: passwordChangedTemplate(loggedUser),
  });

  return res
    .status(204)
    .json(new ApiRes(204, null, "password changed successfully!"));
});

const updateUserDetails = asynchandler(async (req, res) => {
  const { fullName, username, email, mobileNo, gender, documentUrl } = req.body;

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new ApiError(
      409,
      "user already exists with similar username or email",
    );
  }

  const updatedDetails = {};

  if (fullName) updatedDetails.fullName = fullName;
  if (username) updatedDetails.username = username;
  if (email) updatedDetails.email = email;
  if (gender) updatedDetails.gender = gender;

  // Can be null values
  if (mobileNo !== undefined) updatedDetails.mobileNo = mobileNo;
  if (documentUrl !== undefined) updatedDetails.documentUrl = documentUrl;

  if (Object.keys(updatedDetails).length === 0) {
    throw new ApiError(400, "no fields provided to update!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updatedDetails,
    },
    { new: true },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "user details updated successfully!"));
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

  if (loggedUser?.image?.public_id) deleteFromCloudinary(loggedUser?.image);

  const user = await User.findByIdAndUpdate(
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

  return res
    .status(200)
    .json(new ApiRes(200, user, "user resume updated successfully!"));
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
    throw new ApiError(500, "error while updating resumeOrCv on cloudinary!");
  }

  if (loggedUser?.resumeOrCv?.public_id)
    deleteFromCloudinary(loggedUser?.resumeOrCv);

  const user = await User.findByIdAndUpdate(
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

  return res
    .status(200)
    .json(new ApiRes(200, user, "user resume updated successfully!"));
});

const deleteUserResume = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  if (loggedUser?.resumeOrCv?.public_id)
    await deleteFromCloudinary(loggedUser?.resumeOrCv);

  const updatedUser = await User.findByIdAndUpdate(
    loggedUser?._id,
    {
      $unset: {
        resumeOrCv: "",
      },
    },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(500, "couldn't delete resumeOrCv!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "resumeOrCv deleted successfully!"));
});

const deleteUserImage = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  if (loggedUser?.image?.public_id)
    await deleteFromCloudinary(loggedUser?.image);

  const updatedUser = await User.findByIdAndUpdate(
    loggedUser?._id,
    {
      $unset: {
        image: "",
      },
    },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(500, "couldn't delete image!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "image deleted successfully!"));
});

const forgotPassword = asynchandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required!");
  }

  const userExists = User.findOne({ email });

  if (!userExists) {
    throw new ApiError(404, "user does not exists!");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  updateUserDetails,
  updateUserImage,
  updateUserResume,
  deleteUserImage,
  deleteUserResume,
  refreshAccessToken,
};
