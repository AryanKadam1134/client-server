import mongoose, { Schema, model } from "mongoose";

const projectSchema = new Schema(
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
    coverImage: {
      // Couldinary
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
      resource_type: {
        type: String,
        default: "image",
      },
    },
    projectImages: [
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
    githubLink: {
      type: String,
    },
    liveLink: {
      type: String,
    },
    category: {
      type: String,
      enum: ["personal", "freelance", "hackathon", "client", "open-source"],
      default: "personal",
    },
    techStack: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
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

export const Project = model("Project", projectSchema);
