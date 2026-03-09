import mongoose, { Schema, model } from "mongoose";
import { EMPLOYMENT_TYPE } from "../constants.js";

const positionSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (positions) {
          const presentCount = positions.filter((p) => p.present).length;
          return presentCount <= 1;
        },
        message: "Only one position can have present = true",
      },
    },
    present: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

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
    position: {
      type: positionSchema,
      validate: {
        validator: function (positions) {
          const presentCount = positions.filter((p) => p.present).length;
          return presentCount <= 1;
        },
        message: "Only one position can have present = true",
      },
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
    featured: {
      type: Boolean,
      default: true,
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
