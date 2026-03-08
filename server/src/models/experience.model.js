import mongoose, { Schema, model } from "mongoose";
import { EMPLOYMENT_TYPE } from "../constants.js";

const experienceSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    organization: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPE?.map((type) => type.value),
    },
    organizationSize: {
      type: String,
    },
    organizationWebsite: {
      type: String,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },
    highLights: [String],
    techStack: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    location: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (this.present) return value == null;
          return true;
        },
        message: "endDate must be null if present is true",
      },
    },
    present: {
      type: Boolean,
      default: false,
    },
    organizationImage: {
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

export const Experience = model("Experience", experienceSchema);
