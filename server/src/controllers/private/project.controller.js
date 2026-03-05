import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.js";

const addProject = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    title,
    description,
    startDate,
    endDate,
    present,
    githubLink,
    liveLink,
    category,
    techStack,
    visibility,
    sortOrder,
  } = req.body;

  const fields = {};

  if (!title) {
    throw new ApiError(400, "title is required!");
  }

  fields.title = title;

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

  if (coverImage) uploadedCoverImage = await uploadToCloudinary(coverImage);

  const uploadedProjectImages = await Promise.all(
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

  const newProject = await Project.create({ owner: loggedUserId, ...fields });

  if (!newProject) {
    throw new ApiError(500, "couldn't create project!");
  }

  return res
    .status(201)
    .json(new ApiRes(201, newProject, "project created succesfully!"));
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
    githubLink,
    liveLink,
    category,
    techStack,
    visibility,
    sortOrder,
  } = req.body;

  const fields = {};

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

  if (present !== undefined) fields.present = present === "true";
  if (visibility !== undefined) fields.visibility = visibility === "true";
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
    .json(200, updatedProject, "project updated successfully!");
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

  const updatedProject = await findByIdAndUpdate(
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
  const deletedProject = await Project.findByIdAndDelete(req.params?.projectId);

  if (!deletedProject) {
    throw new ApiError(500, "couldn't delete project!");
  }

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

  if (projectExists?.coverImage?.public_id)
    deleteFromCloudinary(projectExists?.coverImage);

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

  const updatedProject = await Project.findByIdAndUpdate(projectId, {
    $pull: {
      projectImages: {
        public_id: imagePublicId,
      },
    },
  });

  if (!updatedProject) {
    throw new ApiError(500, "couldn't delete project image!");
  }

  const projectImage = projectExists?.projectImages?.find(
    (image) => image?.public_id == imagePublicId,
  );

  if (projectImage?.public_id) deleteFromCloudinary(projectImage);

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedProject, "project image deleted successfully!"),
    );
});

export {
  addProject,
  updateProjectDetails,
  updateProjectCoverImage,
  updateProjectImages,
  deleteProject,
  deleteProjectCoverImage,
  deleteProjectImages,
};
