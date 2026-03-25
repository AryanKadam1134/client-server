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

certificateSchema.pre("validate", function (next) {
  if (!this.credentialUrl && !this.certificateImage?.url) {
    return next(
      new Error("Either credential URL or certificate image is required"),
    );
  }
  next();
});

export const Certificate = model("Certificate", certificateSchema);
