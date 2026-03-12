import { Education } from "../../models/education.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

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

export { addEducation };
