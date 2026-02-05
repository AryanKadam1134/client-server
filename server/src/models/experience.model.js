import mongoose, { Schema, model } from "mongoose";

const experienceSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
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
    visibility: {
      type: Boolean,
      default: true,
    },
    experience: {
      type: String,
    },
    companyImage: {
      // Couldinary
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
      resource_type: {
        type: String,
        default: "image",
      },
    },
    techStack: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Experience = model("Experience", experienceSchema);
