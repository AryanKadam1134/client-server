import mongoose from "mongoose";
import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.js";
import { Experience } from "../../models/experience.model.js";

const addProject = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    title,
    description,
    startDate,
    endDate,
    present,
    featured,
    githubLink,
    liveLink,
    category,
    techStack,
    visibility,
    sortOrder,
    organizationId,
  } = req.body;

  const fields = {};

  if (!title) {
    throw new ApiError(400, "title is required!");
  }

  fields.title = title;

  // Add Organization only if it exists
  if (organizationId) {
    let organizationExists;

    organizationExists = await Experience.findById(organizationId);

    if (!organizationExists) {
      throw new ApiError(409, "organization not found!");
    }

    fields.organizationId = organizationId;
  }

  if (description) fields.description = description;
  if (startDate) fields.startDate = startDate;
  if (endDate) fields.endDate = endDate;
  if (githubLink) fields.githubLink = githubLink;
  if (liveLink) fields.liveLink = liveLink;
  if (category) fields.category = category;

  if (techStack?.length > 0)
    fields.techStack = Array.isArray(techStack)
      ? techStack
      : JSON.parse(techStack);

  if (present !== undefined) fields.present = present === "true";
  if (featured !== undefined) fields.featured = featured === "true";
  if (visibility !== undefined) fields.visibility = visibility === "true";
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  const projectExists = await Project.findOne({
    owner: loggedUserId,
    title,
  });

  if (projectExists) {
    throw new ApiError(409, "project name already exists!");
  }

  const coverImage = req.files?.coverImage[0]?.path;
  const projectImages = req.files?.projectImages;

  let uploadedCoverImage;
  let uploadedProjectImages;

  if (coverImage) uploadedCoverImage = await uploadToCloudinary(coverImage);

  if (projectImages?.length > 0)
    uploadedProjectImages = await Promise.all(
      projectImages?.map((image) => uploadToCloudinary(image?.path)),
    );

  if (uploadedCoverImage?.secure_url) {
    fields.coverImage = {
      url: uploadedCoverImage?.secure_url,
      public_id: uploadedCoverImage?.public_id,
      resource_type: uploadedCoverImage?.resource_type,
    };
  }

  if (uploadedProjectImages?.length > 0) {
    fields.projectImages = uploadedProjectImages?.map((image) => ({
      url: image?.secure_url,
      public_id: image?.public_id,
      resource_type: image?.resource_type,
    }));
  }

  const createdProject = await Project.create({
    owner: loggedUserId,
    ...fields,
  });

  if (!createdProject) {
    throw new ApiError(500, "couldn't create project!");
  }

  return res
    .status(201)
    .json(new ApiRes(201, createdProject, "project created succesfully!"));
});

const updateProjectDetails = asynchandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required!");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new ApiError(404, "project not found!");
  }

  const {
    title,
    description,
    startDate,
    endDate,
    present,
    featured,
    githubLink,
    liveLink,
    category,
    techStack,
    visibility,
    sortOrder,
    organizationId,
  } = req.body;

  const fields = {};

  // Updated Organization only if it exists
  if (organizationId !== undefined) {
    let organizationExists;

    organizationExists = await Experience.findById(organizationId);

    if (organizationId && !organizationExists) {
      throw new ApiError(409, "organization not found!");
    }

    fields.organizationId = organizationId;
  }

  if (title) fields.title = title;
  if (description !== undefined) fields.description = description;
  if (startDate !== undefined) fields.startDate = startDate;
  if (endDate !== undefined) fields.endDate = endDate;
  if (githubLink !== undefined) fields.githubLink = githubLink;
  if (liveLink !== undefined) fields.liveLink = liveLink;
  if (category !== undefined) fields.category = category;

  if (techStack !== undefined && techStack?.length > 0)
    fields.techStack = Array.isArray(techStack)
      ? techStack
      : JSON.parse(techStack);

  if (present !== undefined) fields.present = present;
  if (featured !== undefined) fields.featured = featured;
  if (visibility !== undefined) fields.visibility = visibility;
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: fields,
    },
    { runValidators: true, new: true },
  );

  if (!updatedProject) {
    throw new ApiError(500, "couldn't update project!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedProject, "project updated successfully!"));
});

const updateProjectCoverImage = asynchandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required!");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new ApiError(404, "project not found!");
  }

  const coverImage = req.file?.path;

  if (!coverImage) {
    throw new ApiError(400, "missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(coverImage);

  if (!updatedImage?.secure_url) {
    throw new ApiError(500, "error while updating image on cloudinary!");
  }

  if (projectExists?.coverImage?.public_id)
    deleteFromCloudinary(projectExists?.coverImage);

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        coverImage: {
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
        "project coverImage updated successfully!",
      ),
    );
});

const updateProjectImages = asynchandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required!");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new ApiError(404, "project not found!");
  }

  const newImages = req.files;

  if (projectExists?.projectImages?.length + newImages?.length > 5) {
    throw new ApiError(400, "maximum 5 project images are allowed");
  }

  const uploadedProjectImages = await Promise.all(
    newImages?.map((image) => uploadToCloudinary(image?.path)),
  );

  const formattedImages = uploadedProjectImages?.map((image) => ({
    url: image?.secure_url,
    public_id: image?.public_id,
    resource_type: image?.resource_type,
  }));

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $push: {
        projectImages: {
          $each: formattedImages,
        },
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedProject, "project images updated successfully!"),
    );
});

const deleteProject = asynchandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required!");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new ApiError(404, "project not found!");
  }

  if (projectExists?.coverImage?.public_id)
    await deleteFromCloudinary(projectExists?.coverImage);

  if (projectExists?.projectImages?.length > 0)
    await Promise.all(
      projectExists?.projectImages?.map((image) => deleteFromCloudinary(image)),
    );

  await Project.findByIdAndDelete(projectId);

  return res
    .status(200)
    .json(new ApiRes(200, null, "project deleted successfully!"));
});

const deleteProjectCoverImage = asynchandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required!");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new ApiError(404, "project not found!");
  }

  if (projectExists?.coverImage?.public_id)
    await deleteFromCloudinary(projectExists?.coverImage);

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $unset: { coverImage: "" },
    },
    { new: true },
  );

  if (!updatedProject) {
    throw new ApiError(500, "couldn't delete coverImage!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedProject, "coverImage deleted successfully!"));
});

const deleteProjectImages = asynchandler(async (req, res) => {
  const { projectId, imagePublicId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required!");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new ApiError(404, "project not found!");
  }

  const projectImage = projectExists?.projectImages?.find(
    (image) => image?.public_id == imagePublicId,
  );

  if (!projectImage?.public_id) {
    throw new ApiError(404, "project image doesn't exists!");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $pull: {
        projectImages: {
          public_id: imagePublicId,
        },
      },
    },
    { new: true },
  );

  if (!updatedProject) {
    throw new ApiError(500, "couldn't delete project image!");
  }

  deleteFromCloudinary(projectImage);

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedProject, "project image deleted successfully!"),
    );
});

const getAllProjects = asynchandler(async (req, res) => {
  const projects = await Project.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "techStack",
        foreignField: "_id",
        as: "techStack",
      },
    },
  ]);

  if (!projects) {
    throw new ApiError(500, "couldn't get projects!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, projects, "projects fetched successfully!"));
});

export {
  addProject,
  updateProjectDetails,
  updateProjectCoverImage,
  updateProjectImages,
  deleteProject,
  deleteProjectCoverImage,
  deleteProjectImages,
  getAllProjects,
};
