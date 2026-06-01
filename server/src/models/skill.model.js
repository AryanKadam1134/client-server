import mongoose, { Schema, model } from "mongoose";

import { SKILL_LEVEL, VISIBILITY } from "../constants.js";

const skillSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "SkillCategory",
    },
    description: String,

    logoUrl: String,

    level: {
      type: String,
      enum: SKILL_LEVEL.map((s) => s.value),
      default: "basic",
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

export const Skill = model("Skill", skillSchema);
