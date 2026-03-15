import { Education } from "../../models/education.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.js";

const addEducation = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    instituteName,
    qualification,
    description,
    address,
    startYear,
    endYear,
    present,
    percentage,
    cgpa,
    sortOrder,
  } = req.body;

  const fields = {};

  if (!instituteName) {
    throw new ApiError(400, "instituteName is required!");
  }

  fields.instituteName = instituteName;

  if (qualification) fields.qualification = qualification;
  if (description) fields.description = description;
  if (address) fields.address = address;
  if (startYear) fields.startYear = startYear;
  if (endYear) fields.endYear = endYear;
  if (percentage) fields.percentage = percentage;
  if (cgpa) fields.cgpa = cgpa;

  if (present !== undefined) fields.present = present === "true";
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  const educationExists = await Education.findOne({
    owner: loggedUserId,
    instituteName,
  });

  if (educationExists) {
    throw new ApiError(409, "education already exists!");
  }

  let uploadedInstituteImage;

  const instituteImage = req.file?.path;

  if (instituteImage)
    uploadedInstituteImage = await uploadToCloudinary(instituteImage);

  if (uploadedInstituteImage?.secure_url) {
    fields.instituteImage = {
      url: uploadedInstituteImage?.secure_url,
      public_id: uploadedInstituteImage?.public_id,
      resource_type: uploadedInstituteImage?.secure_resource_type,
    };
  }

  const createdInstitute = await Education.create({
    owner: loggedUserId,
    ...fields,
  });

  if (!createdInstitute) {
    throw new ApiError(500, "couldn't create institute!");
  }

  return res
    .status(201)
    .json(new ApiRes(201, createdInstitute, "institute created successfully!"));
});

const updateEducationDetails = asynchandler(async (req, res) => {
  const { educationId } = req.params;

  const educationExists = await Education.findById(educationId);

  if (!educationExists) {
    throw new ApiError(404, "education does not exists!");
  }

  const {
    instituteName,
    qualification,
    description,
    address,
    startYear,
    endYear,
    present,
    percentage,
    cgpa,
    sortOrder,
  } = req.body;

  const fields = {};

  if (instituteName !== undefined) fields.instituteName = instituteName;
  if (qualification !== undefined) fields.qualification = qualification;
  if (description !== undefined) fields.description = description;
  if (address !== undefined) fields.address = address;
  if (startYear !== undefined) fields.startYear = startYear;
  if (endYear !== undefined) fields.endYear = endYear;
  if (percentage !== undefined) fields.percentage = percentage;
  if (cgpa !== undefined) fields.cgpa = cgpa;

  if (present !== undefined) fields.present = present;
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  const updatedEducation = await Education.findByIdAndUpdate(
    educationId,
    {
      $set: fields,
    },
    { new: true },
  );

  if (!updatedEducation) {
    throw new ApiError(500, "couldn't update education!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedEducation, "education updated succesfully!"));
});

const updateInstituteImage = asynchandler(async (req, res) => {
  const { instituteId } = req.params;

  if (!instituteId) {
    throw new ApiError(400, "instituteId is required!");
  }

  const instituteExists = await Education.findById(instituteId);

  if (!instituteExists) {
    throw new ApiError(404, "institute not found!");
  }

  const instituteImage = req.file?.path;

  if (!instituteImage) {
    throw new ApiError(400, "missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(instituteImage);

  if (!updatedImage?.secure_url) {
    throw new ApiError(500, "error while updating image on cloudinary!");
  }

  if (instituteExists?.instituteImage?.public_id)
    deleteFromCloudinary(instituteExists?.instituteImage);

  const updatedInstitute = await Education.findByIdAndUpdate(
    instituteId,
    {
      $set: {
        instituteImage: {
          url: updatedImage?.secure_url,
          public_id: updatedImage?.public_id,
          resource_type: updatedImage?.resource_type,
        },
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedInstitute, "instituteImage updated successfully!"),
    );
});

export { addEducation, updateEducationDetails, updateInstituteImage };
