import mongoose, { Schema, model } from "mongoose";

import { VISIBILITY } from "../constants.js";

import ApiError from "../utils/ApiError.js";

const certificateSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    issuer: {
      type: String,
      required: true,
    },

    credentialId: String,
    credentialUrl: String,

    // Couldinary
    certificateImage: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    issueDate: Date,
    expiryDate: Date,

    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

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

certificateSchema.pre("validate", async function () {
  if (!this.credentialUrl && !this.certificateImage?.url) {
    throw new ApiError(
      500,
      "Either credential URL or certificate image is required",
    );
  }
});

export const Certificate = model("Certificate", certificateSchema);
