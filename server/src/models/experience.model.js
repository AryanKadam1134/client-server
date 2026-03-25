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
        validator: function (value) {
          if (this.present && value) return false;
          return true;
        },
        message: "endDate must be null when present is true",
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
    description: String,
    organizationSize: String,
    organizationWebsite: {
      type: String,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },

    position: [
      {
        type: positionSchema,
      },
    ],

    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPE?.map((type) => type.value),
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

    // Couldinary
    organizationImage: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    featured: {
      type: Boolean,
      default: true,
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

experienceSchema.pre("validate", function (next) {
  if (!this.position || this.position.length === 0) {
    return next();
  }

  const presentCount = this.position.filter((p) => p.present).length;

  if (presentCount > 1) {
    return next(new Error("Only one position can have present=true"));
  }

  // next();
});

export const Experience = model("Experience", experienceSchema);
