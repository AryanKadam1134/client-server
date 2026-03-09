import { Experience } from "../../models/experience.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.js";

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

const updateExperience = asynchandler(async (req, res) => {
  const { experienceId } = req.params;

  const expeirneceExists = await Experience.findById(experienceId);

  if (!expeirneceExists) {
    throw new ApiError(404, "couldn't find experience!");
  }

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

  if (organization) fields.organization = organization;
  if (description !== undefined) fields.description = description;
  if (employmentType !== undefined) fields.employmentType = employmentType;
  if (organizationSize !== undefined)
    fields.organizationSize = organizationSize;
  if (organizationWebsite !== undefined)
    fields.organizationWebsite = organizationWebsite;
  if (location !== undefined) fields.location = location;

  if (position !== undefined && position?.length > 0)
    fields.position = Array.isArray(position) ? position : JSON.parse(position);

  if (techStack !== undefined && techStack?.length > 0)
    fields.techStack = Array.isArray(techStack)
      ? techStack
      : JSON.parse(techStack);

  if (highLights !== undefined && highLights?.length > 0)
    fields.highLights = Array.isArray(highLights)
      ? highLights
      : JSON.parse(highLights);

  if (featured !== undefined) fields.featured = featured;
  if (visibility !== undefined) fields.visibility = visibility;
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  const updatedExperience = await Experience.findByIdAndUpdate(
    experienceId,
    {
      $set: fields,
    },
    { runValidators: true, new: true },
  );

  if (!updatedExperience) {
    throw new ApiError(500, "couldn't update experience!");
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedExperience, "experience updated successfully!"),
    );
});

const updateOrganizationImage = asynchandler(async (req, res) => {
  const { experienceId } = req.params;

  const expeirneceExists = await Experience.findById(experienceId);

  if (!expeirneceExists) {
    throw new ApiError(404, "couldn't find experience!");
  }

  const organizationImage = req.file?.path;

  if (!organizationImage) {
    throw new ApiError(400, "missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(organizationImage);

  if (!updatedImage?.secure_url) {
    throw new ApiError(500, "error while updating image on cloudinary!");
  }

  if (expeirneceExists?.organizationImage?.public_id)
    deleteFromCloudinary(expeirneceExists?.organizationImage);

  const updatedProject = await Project.findByIdAndUpdate(
    experienceId,
    {
      $set: {
        organizationImage: {
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
      new ApiRes(
        200,
        updatedProject,
        "project organizationImage updated successfully!",
      ),
    );
});

const deleteExperience = asynchandler(async (req, res) => {
  const { experienceId } = req.params;

  const expeirneceExists = await Experience.findById(experienceId);

  if (!expeirneceExists) {
    throw new ApiError(404, "couldn't find organization!");
  }

  if (expeirneceExists?.organizationImage?.public_id)
    await deleteFromCloudinary(expeirneceExists?.organizationImage);

  await Experience.findByIdAndDelete(experienceId);

  return res
    .status(200)
    .json(new ApiRes(200, null, "experience deleted successfully!"));
});

const deleteOrganiaztionImage = asynchandler(async (req, res) => {
  const { experienceId } = req.params;

  const expeirneceExists = await Experience.findById(experienceId);

  if (!expeirneceExists) {
    throw new ApiError(404, "couldn't find organization!");
  }

  if (expeirneceExists?.organizationImage?.public_id)
    await deleteFromCloudinary(expeirneceExists?.organizationImage);

  const upatedExpereince = await Experience.findByIdAndUpdate(
    experienceId,
    {
      $set: {
        $unset: { organizationImage: "" },
      },
    },
    { new: true },
  );

  if (!upatedExpereince) {
    throw new ApiError(500, "couldn't delete organizationImage!");
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        upatedExpereince,
        "organizationImage deleted successfully!",
      ),
    );
});

const getAllExperiences = asynchandler(async (req, res) => {
  const experiences = await Experience.find({ owner: req.user?._id });

  if (experiences?.length <= 0) {
    throw new ApiError(404, "user does not have any experiences!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, experiences, "experiences fetched succesfully!"));
});

export {
  addExperience,
  updateExperience,
  updateOrganizationImage,
  deleteExperience,
  deleteOrganiaztionImage,
  getAllExperiences,
};
