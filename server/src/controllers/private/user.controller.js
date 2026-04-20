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

const generateAccessAndRefreshToken = async (userId, req) => {
  if (!userId) return;

  const deviceId = req.headers["x-device-id"];

  if (!deviceId) {
    throw new ApiError(400, "Device ID missing");
  }

  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log("accessToken: ", accessToken);
    // console.log("refreshToken: ", refreshToken);

    let rememberMe;

    // add new session
    const existingSessionIndex = user.sessions.findIndex(
      (s) => s.deviceId === deviceId,
    );

    if (existingSessionIndex !== -1) {
      // ✅ Preserve existing value
      rememberMe = user.sessions[existingSessionIndex].rememberMe;
    } else {
      // ✅ Only take from login request
      rememberMe = req.body?.rememberMe ?? false;
    }

    // ✅ CASE 1: Device already exists → UPDATE session
    if (existingSessionIndex !== -1) {
      const session = user.sessions[existingSessionIndex];
      session.refreshToken = refreshToken;
      session.rememberMe = rememberMe;
      session.userAgent = req.headers["user-agent"];
      session.ip = req.ip;
      session.createdAt = new Date();
    }

    // ✅ CASE 2: New device
    else {
      if (user.sessions.length >= 5) {
        throw new ApiError(403, "Maximum devices limit reached (5)");
      }

      user.sessions.push({
        deviceId,
        refreshToken,
        rememberMe,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      });
    }

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error Generating Access or Refresh Token: ", error);
    throw new ApiError(501, "Couldn't generate Refresh token and Access token");
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = asynchandler(async (req, res) => {
  const { credential, rememberMe } = req.body;

  const deviceId = req.headers["x-device-id"];
  if (!deviceId) {
    throw new ApiError(400, "Device ID missing");
  }

  if (!credential) {
    throw new ApiError(400, "Google credential missing");
  }

  // ✅ Verify token from Google
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { email, given_name, family_name, picture, sub } = payload;

  if (!email) {
    throw new ApiError(400, "Google account has no email");
  }

  // ✅ Check if user exists
  let user = await User.findOne({ email });

  // ✅ CASE 1: New user → Register
  if (!user) {
    user = await User.create({
      firstName: given_name || "User",
      lastName: family_name || "",
      username: email.split("@")[0] + "_" + Date.now(), // unique username
      email,
      password: undefined, // IMPORTANT: no password
      googleId: sub,
    });
  }

  // ✅ CASE 2: Existing user but no googleId → link account
  if (!user.googleId) {
    user.googleId = sub;
    await user.save({ validateBeforeSave: false });
  }

  // ✅ Generate tokens using YOUR system
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
    req,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "Couldn't generate tokens");
  }

  const loggedUser = await User.findById(user._id).select(
    "-password -sessions",
  );

  // ✅ SAME cookie logic as your login
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie(
      "refreshToken",
      refreshToken,
      rememberMe ? refreshTokenOptions : options,
    )
    .json(
      new ApiRes(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "Google login successful!",
      ),
    );
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const cookieRefreshToken = req.cookies?.refreshToken;

  const deviceId = req.headers["x-device-id"];

  if (!cookieRefreshToken) {
    throw new ApiError(401, "No refresh token");
  }

  if (!deviceId) {
    throw new ApiError(400, "Device ID missing");
  }

  // Decode Token
  const decodedToken = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const loggedUser = await User.findById(decodedToken?._id);

  if (!loggedUser) {
    throw new ApiError(404, "user not found!");
  }

  const session = loggedUser.sessions.find((s) => s.deviceId === deviceId);

  if (!session) {
    throw new ApiError(419, "session expired!");
  }

  const rememberMe = session.rememberMe;

  // Get access and referesh Token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    loggedUser?._id,
    req,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "couldn't generate access or refresh token!");
  }

  const user = await User.findById(loggedUser._id).select(
    "-password -sessions",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie(
      "refreshToken",
      refreshToken,
      rememberMe ? refreshTokenOptions : options,
    )
    .json(
      new ApiRes(
        200,
        { user, accessToken, refreshToken },
        "session revived successfully!",
      ),
    );
});

const registerUser = asynchandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (
    [firstName, lastName, username, email, password].some(
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
    firstName,
    lastName,
    username: username?.toLowerCase(),
    email,
    password,
  });

  return res
    .status(201)
    .json(new ApiRes(201, createdUser, "user created successfully!"));
});

const loginUser = asynchandler(async (req, res) => {
  const { userCredential, password, rememberMe } = req.body;

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
    req,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "couldn't generate access or refresh token!");
  }

  const loggedUser = await User.findById(userExist?._id).select(
    "-password -refreshToken -sessions",
  );

  if (!loggedUser) {
    throw new ApiError(500, "error logging in user!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie(
      "refreshToken",
      refreshToken,
      rememberMe ? refreshTokenOptions : options,
    )
    .json(
      new ApiRes(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "user logged in successfully!",
      ),
    );
});

const logoutUser = asynchandler(async (req, res) => {
  const cookieRefreshToken = req.cookies?.refreshToken;

  await User.findByIdAndUpdate(req.user?._id, {
    $pull: { sessions: { refreshToken: cookieRefreshToken } },
  });

  return res
    .status(204)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiRes(204, "user logged out successfully!"));
});

const hasPassowrd = asynchandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user?.password && user?.googleId) {
    return res.status(200).json(new ApiRes(200, false, ""));
  } else {
    return res.status(200).json(new ApiRes(200, true, ""));
  }
});

const changePassword = asynchandler(async (req, res) => {
  const { isInitializing, old_password, new_password } = req.body;

  const loggedUser = await User.findById(req.user?._id);

  if (!isInitializing) {
    if (!old_password || !new_password) {
      throw new ApiError(400, "all fields are required!");
    }

    const isPasswordCorrect = await loggedUser.isPasswordCorrect(old_password);

    if (!isPasswordCorrect) {
      throw new ApiError(409, "invalid password!");
    }

    if (new_password === old_password) {
      throw new ApiError(409, "new password connot be same as old password!");
    }
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
  googleAuth,
  registerUser,
  loginUser,
  logoutUser,
  hasPassowrd,
  changePassword,
  updateUserDetails,
  getUserDetails,
  updateUserImage,
  updateUserResume,
  deleteUserImage,
  deleteUserResume,
  refreshAccessToken,
};
