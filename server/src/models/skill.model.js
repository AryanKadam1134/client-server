import mongoose, { Schema, model } from "mongoose";

import { SKILL_LEVEL } from "../constants.js";

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
    category: {
      type: Schema.Types.ObjectId,
      ref: "SkillCategory",
      required: true,
    },
    level: {
      type: String,
      enum: SKILL_LEVEL.map((s) => s.value),
      required: true,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Skill = model("Skill", skillSchema);
