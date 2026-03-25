import mongoose, { Schema, model } from "mongoose";

const educationSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instituteName: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    description: String,
    address: String,

    startYear: {
      type: Number,
      required: true,
    },
    endYear: {
      type: Number,
      validate: {
        validator: function (value) {
          if (this.present && value) return false;
          return true;
        },
        message: "endYear must be null when present is true",
      },
    },
    present: {
      type: Boolean,
      default: false,
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },

    // Couldinary
    instituteImage: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Education = model("Education", educationSchema);
