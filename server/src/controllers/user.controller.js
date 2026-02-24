import { options } from "../constants.js";

import { User } from "../models/user.model.js";

import ApiRes from "../utils/ApiRes.js";
import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import sendEmail from "../utils/mailShooter.js";
import { passwordChanged } from "../utils/emailTemplates/passwordChanged.js";

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

const registerUser = asynchandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const image = req.files?.image[0]?.path;
  const resumeOrCv = req.files?.resumeOrCv[0]?.path;

  if (
    [fullName, username, email, password].some(
      (field) => typeof field == "string" && field?.trim() == "",
    )
  ) {
    throw new ApiError(400, "all fields are required!");
  }

  if (!image || !resumeOrCv) {
    throw new ApiError(400, "image and resumeOrCv are required!");
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

  const userImage = await uploadToCloudinary(image);
  const userDocument = await uploadToCloudinary(resumeOrCv);

  if (!userImage) {
    throw new ApiError(500, "couldn't find userImage!");
  }

  if (!userDocument) {
    throw new ApiError(500, "couldn't find userDocument!");
  }

  const createdUser = await User.create({
    fullName,
    username: username?.toLowerCase(),
    email,
    password,
    image: {
      url: userImage?.secure_url,
      public_id: userImage?.public_id,
      resource_type: userImage?.resource_type,
    },
    resumeOrCv: {
      url: userDocument?.secure_url,
      public_id: userDocument?.public_id,
      resource_type: userDocument?.resource_type,
    },
  });

  if (!createdUser?._id) {
    throw new ApiError(500, "couldn't create an user!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, createdUser, "user created successfully!"));
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
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiRes(200, "user logged out successfully!"));
});

const changePassword = asynchandler(async (req, res) => {
  const { old_password, new_password } = req.body;

  console.log("old_password: ", old_password);
  console.log("new_password: ", new_password);

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
    .status(200)
    .json(new ApiRes(200, {}, "password changed successfully!"));
});



export { registerUser, loginUser, logoutUser, changePassword };
