import mongoose, { Schema, model } from "mongoose";

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
    description: {
      type: String,
    },
    images: [
      {
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
    ],
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

export const Achievement = model("Achievement", achievementSchema);
