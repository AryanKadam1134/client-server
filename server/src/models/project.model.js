import mongoose, { Schema, model } from "mongoose";

import { PROJECT_CATEGORIES, VISIBILITY } from "../constants.js";

const projectSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
    },
    title: {
      type: String,
      required: true,
    },
    description: String,

    startDate: Date,
    endDate: Date,

    isCurrent: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (value) {
          // If endDate exists, isCurrent must be false
          if (this.endDate && value === true) {
            return false;
          }
          return true;
        },
        message: "isCurrent must be false if endDate is provided",
      },
    },

    category: {
      type: String,
      enum: PROJECT_CATEGORIES?.map((p) => p?.value),
      default: "personal",
    },

    techStack: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    // Couldinary
    coverImageIndex: {
      type: Number,
      default: 0,
    },
    projectImages: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],

    githubLink: { type: String, match: [/^https?:\/\/.+/, "Invalid URL"] },
    liveLink: { type: String, match: [/^https?:\/\/.+/, "Invalid URL"] },

    featured: {
      type: Boolean,
      default: true,
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

projectSchema.index({ owner: 1, title: 1 }, { unique: true });

export const Project = model("Project", projectSchema);
