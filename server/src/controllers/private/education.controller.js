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

  if (!educationId) {
    throw new ApiError(400, "educationId is required!");
  }

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
  const { educationId } = req.params;

  if (!educationId) {
    throw new ApiError(400, "educationId is required!");
  }

  const educationExists = await Education.findById(educationId);

  if (!educationExists) {
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

  if (educationExists?.instituteImage?.public_id)
    deleteFromCloudinary(educationExists?.instituteImage);

  const updatedEducation = await Education.findByIdAndUpdate(
    educationId,
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
      new ApiRes(200, updatedEducation, "instituteImage updated successfully!"),
    );
});

const deleteEducation = asynchandler(async (req, res) => {
  const { educationId } = req.params;

  const educationExists = await Education.findById(educationId);

  if (!educationExists) {
    throw new ApiError(404, "education does not exists!");
  }

  if (educationExists?.instituteImage?.public_id)
    await deleteFromCloudinary(educationExists?.instituteImage);

  await Education.findByIdAndDelete(educationId);

  return res
    .status(200)
    .json(new ApiRes(200, null, "education deleted successfully!"));
});

const deleteInstituteImage = asynchandler(async (req, res) => {
  const { educationId } = req.params;

  if (!educationId) {
    throw new ApiError(400, "educationId is required!");
  }

  const educationExists = await Education.findById(educationId);

  if (!educationExists) {
    throw new ApiError(404, "institute not found!");
  }

  if (educationExists?.instituteImage?.public_id)
    await deleteFromCloudinary(educationExists?.instituteImage);

  const updatedEducation = await Education.findByIdAndUpdate(
    educationId,
    {
      $unset: { instituteImage: "" },
    },
    { new: true },
  );

  if (!updatedEducation) {
    throw new ApiError(500, "couldn't delete instituteImage!");
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedEducation, "instituteImage deleted successfully!"),
    );
});

const getAllEducations = asynchandler(async (req, res) => {
  const educations = await Education.find({ owner: req.user?._id });

  if (educations?.length <= 0) {
    throw new ApiError(200, "user do not have any educations!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, educations, "educations fetched successfully!"));
});

export {
  addEducation,
  updateEducationDetails,
  updateInstituteImage,
  deleteEducation,
  deleteInstituteImage,
  getAllEducations,
};
