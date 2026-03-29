import mongoose, { Schema, model } from "mongoose";
import { SOCIAL_PLATFORMS, VISIBILITY } from "../constants.js";

const socialAccountSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      enum: SOCIAL_PLATFORMS.map((p) => p.value),
      required: true,
    },
    link: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },
    visibility: {
      type: String,
      enum: VISIBILITY.map((v) => v.value),
      default: "public",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

socialAccountSchema.index({ owner: 1, name: 1 }, { unique: true });

export const SocialAccount = model("SocialAccount", socialAccountSchema);
