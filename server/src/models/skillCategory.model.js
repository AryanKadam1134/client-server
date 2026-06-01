import mongoose, { Schema, model } from "mongoose";

import { VISIBILITY } from "../constants.js";

const skillCategorySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },

    logoUrl: String,

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

skillCategorySchema.index({ owner: 1, name: 1 }, { unique: true });

export const SkillCategory = model("SkillCategory", skillCategorySchema);
