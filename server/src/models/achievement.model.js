import mongoose, { Schema, model } from "mongoose";

import { VISIBILITY } from "../constants.js";

const achievementSchema = new Schema(
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

    certificateId: {
      type: Schema.Types.ObjectId,
      ref: "Certificate",
    },

    description: String,
    issuer: String,
    link: { type: String, match: [/^https?:\/\/.+/, "Invalid URL"] },

    date: Date,

    location: String,

    // Couldinary
    coverImageIndex: {
      type: Number,
      default: 0,
    },
    achievementImages: [
      {
        url: String,
        public_id: String,
        resource_type: String,
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

achievementSchema.index({ owner: 1, sortOrder: 1 });
achievementSchema.index({ owner: 1, date: -1 });

export const Achievement = model("Achievement", achievementSchema);
