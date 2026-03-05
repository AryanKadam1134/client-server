import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GENDERS } from "../constants.js";

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "password is required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required!"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobileNo: {
      type: Number,
      unique: true,
    },
    gender: {
      type: String,
      enum: GENDERS.map((g) => g.value),
    },
    image: {
      // Couldinary
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
      resource_type: {
        type: String,
      },
    },
    resumeOrCv: {
      // Couldinary
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
      resource_type: {
        type: String,
        default: "image",
      },
    },
    documentUrl: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = model("User", userSchema);
