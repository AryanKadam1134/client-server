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
import { passwordChangedTemplate } from "../../utils/emailTemplates/passwordChanged.js";
import { resetPasswordOTPTemplate } from "../../utils/emailTemplates/otpSentTemplate.js";

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
        throw new ApiError(429, "Maximum devices limit reached (5)");
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
    throw new ApiError(500, "Couldn't generate Refresh token and Access token");
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
    throw new ApiError(500, "Couldn't generate tokens");
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
    throw new ApiError(401, "session expired!");
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

const changePassword = asynchandler(async (req, res) => {
  const { isInitializing, old_password, new_password, confirm_password } =
    req.body;

  const loggedUser = await User.findById(req.user?._id);

  if (!isInitializing) {
    if (!old_password || !new_password || !confirm_password) {
      throw new ApiError(400, "All fields are required!");
    }

    // Validate password confirmation match
    if (new_password !== confirm_password) {
      throw new ApiError(
        400,
        "Passwords do not match! Please ensure new password and confirm password are the same.",
      );
    }

    const isPasswordCorrect = await loggedUser.isPasswordCorrect(old_password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid current password!");
    }

    if (new_password === old_password) {
      throw new ApiError(
        400,
        "New password cannot be the same as old password!",
      );
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
    .status(200)
    .json(new ApiRes(200, null, "Password changed successfully!"));
});

const forgotPassword = asynchandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp;
  user.otpExpiryDate = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Fail safe
  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Password OTP",
      html: resetPasswordOTPTemplate(user, otp),
    });
  } catch (error) {
    console.error("Error sending mail in changePassword: ", error);
  }

  return res.status(200).json(new ApiRes(200, null, "OTP sent to your email!"));
});

const verifyOTP = asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (user.otp !== otp || user.otpExpiryDate < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP!");
  }

  return res.status(200).json(new ApiRes(200, null, "OTP verified!"));
});

const resetPassword = asynchandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, "newPassword is required!");
  }

  const user = User.findOne({ email });

  const isPasswordCorrect = await user.isPasswordCorrect(newPassword);

  if (isPasswordCorrect) {
    throw new ApiError(409, "new password cannot be same as old password!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // Fail safe
  try {
    await sendEmail({
      to: user.email,
      subject: "Your Password Was Changed Successfully 🔐",
      html: passwordChangedTemplate(user),
    });
  } catch (error) {
    console.error("Error sending mail in changePassword: ", error);
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "Password changed successfully!"));
});

export {
  googleAuth,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
