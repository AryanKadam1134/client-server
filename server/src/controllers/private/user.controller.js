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

  // Decode Token
  const decodedToken = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const loggedUser = await User.findById(decodedToken?._id);

  if (!loggedUser) {
    throw new ApiError(404, "user not found!");
  }

  if (loggedUser?.refreshToken !== cookieRefreshToken) {
    throw new ApiError(419, "session expired!");
  }

  // Get access and referesh Token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    loggedUser?._id,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "couldn't generate access or refresh token!");
  }

  const user = await User.findById(loggedUser?._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRes(
        200,
        { user, accessToken, refreshToken },
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

  return res
    .status(201)
    .json(new ApiRes(201, createdUser, "user created successfully!"));
});

const loginUser = asynchandler(async (req, res) => {
  const { userCredential, password } = req.body;

  if (!userCredential) {
    throw new ApiError(400, "username or email is required!");
  }

  if (!password) {
    throw new ApiError(400, "password is required!");
  }

  const userExist = await User.findOne({
    $or: [{ username: userCredential }, { email: userCredential }],
  });

  if (!userExist) {
    throw new ApiError(404, "user not found!");
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

  // Fail safe
  try {
    await sendEmail({
      to: loggedUser.email,
      subject: "Your Password Was Changed Successfully 🔐",
      html: passwordChangedTemplate(loggedUser),
    });
  } catch (error) {
    console.error("Error sending mail in changePassword: ", error);
  }

  return res
    .status(204)
    .json(new ApiRes(204, null, "password changed successfully!"));
});

const updateUserDetails = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { fullName, username, email, mobileNo, gender, documentUrl } = req.body;

  const fields = {};

  if (username) fields.username = username;
  if (email) fields.email = email;
  if (fullName) fields.fullName = fullName;
  if (gender) fields.gender = gender;

  // Can be null values
  if (mobileNo !== undefined) fields.mobileNo = mobileNo;
  if (documentUrl !== undefined) fields.documentUrl = documentUrl;

  if (Object.keys(fields).length === 0) {
    throw new ApiError(400, "no fields provided to update!");
  }

  // Check if user exists if username or email is provided
  if (username || email) {
    const userExists = await User.findOne({
      $or: [{ username }, { email }],
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
