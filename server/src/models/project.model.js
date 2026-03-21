import mongoose, { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
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
    },
    endDate: {
      type: Date,
    },
    present: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (value) {
          // If endDate exists, present must be false
          if (this.endDate && value === true) {
            return false;
          }
          return true;
        },
        message: "present must be false if endDate is provided",
      },
    },
    featured: {
      type: Boolean,
      default: true,
    },
    coverImage: {
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

projectSchema.index({ owner: 1, title: 1 }, { unique: true });

export const Project = model("Project", projectSchema);
