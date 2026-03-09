import { Experience } from "../../models/experience.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

const addExperience = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    organization,
    description,
    employmentType,
    organizationSize,
    organizationWebsite,
    location,
    position,
    highLights,
    techStack,
    featured,
    visibility,
    sortOrder,
  } = req.body;

  const fields = {};

  if (!organization) {
    throw new ApiError(400, "organization is required!");
  }

  fields.organization = organization;

  if (description) fields.description = description;
  if (employmentType) fields.employmentType = employmentType;
  if (organizationSize) fields.organizationSize = organizationSize;
  if (organizationWebsite) fields.organizationWebsite = organizationWebsite;
  if (location) fields.location = location;

  if (position?.length > 0)
    fields.position = Array.isArray(position) ? position : JSON.parse(position);

  if (techStack?.length > 0)
    fields.techStack = Array.isArray(techStack)
      ? techStack
      : JSON.parse(techStack);

  if (highLights?.length > 0)
    fields.highLights = Array.isArray(highLights)
      ? highLights
      : JSON.parse(highLights);

  if (featured !== undefined) fields.featured = featured === "true";
  if (visibility !== undefined) fields.visibility = visibility === "true";
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  const oragnizationExists = await Experience.findOne({
    owner: loggedUserId,
    organization,
  });

  if (oragnizationExists) {
    throw new ApiError(409, "organization name already exists!");
  }

  let uploadedOrganizationImage;

  const organizationImage = req.files?.organizationImage[0]?.path;

  if (organizationImage)
    uploadedOrganizationImage = await uploadToCloudinary(organizationImage);

  if (uploadedOrganizationImage?.secure_url) {
    fields.organizationImage = {
      url: uploadedOrganizationImage?.secure_url,
      public_url: uploadedOrganizationImage?.public_url,
      resource_type: uploadedOrganizationImage?.resource_type,
    };
  }

  const createdOrganization = await Experience.create({
    owner: loggedUserId,
    ...fields,
  });

  if (!createdOrganization) {
    throw new ApiError(500, "couldn't create project!");
  }

  return res
    .status(201)
    .json(
      new ApiRes(201, createdOrganization, "experience created successfully!"),
    );
});

export { addExperience };
