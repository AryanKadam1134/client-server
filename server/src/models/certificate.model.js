import mongoose, { Schema, model } from "mongoose";

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
    description: {
      type: String,
    },
    issuer: {
      type: String,
      required: true,
    },
    certificateUrl: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
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

export const Certificate = model("Certificate", certificateSchema);
