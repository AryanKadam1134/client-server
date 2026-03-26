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
    description: String,

    startDate: Date,
    endDate: Date,

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

    // Couldinary
    coverImageIndex: {
      type: Number,
      default: 0,
    },
    projectImages: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],

    githubLink: String,
    liveLink: String,

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

projectSchema.index({ owner: 1, title: 1 }, { unique: true });

export const Project = model("Project", projectSchema);
