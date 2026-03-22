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
      unique: true,
    },
    visibility: {
      type: Boolean,
      default: true,
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
