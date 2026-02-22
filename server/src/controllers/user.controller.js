import { options } from "../constants";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import ApiRes from "../utils/ApiRes";
import asynchandler from "../utils/asynchandler";

const generateAccessAndRefreshToken = async (userId) => {
  if (!userId) return;

  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error Generating Access or Refresh Token: ", error);
    throw new apiError(501, "Couldn't generate Refresh token and Access token");
  }
};

const loginUser = asynchandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "username and password is required!");
  }

  const userExist = await User.findOne({
    username,
  });
  const userId = userExist?._id;

  if (!userExist) {
    throw new ApiError(404, "user does not exists!");
  }

  const isPasswordCorrect = userExist.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "invalid password!");
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(
    userExist?._id,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "couldn't generate access or refresh token!");
  }

  const loggedUser = await User.findById(userExist?._id).select(
    "-password -refreshToken",
  );

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

export { loginUser };
