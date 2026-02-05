import mongoose, { Schema, model } from "mongoose";

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
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const SkillCategory = model("SkillCategory", skillCategorySchema);
