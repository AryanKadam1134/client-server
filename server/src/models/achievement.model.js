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
    description: String,

    date: Date,

    // Couldinary
    images: [
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
