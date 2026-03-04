import { Project } from "../../models/project.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

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
  if (typeof present == "boolean") fields.present = present;
  if (githubLink) fields.githubLink = githubLink;
  if (liveLink) fields.liveLink = liveLink;
  if (category) fields.category = category;
  if (techStack?.length > 0) fields.techStack = techStack;
  if (typeof visibility == "boolean") fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const projectExists = await Project.findOne({
    owner: loggedUserId,
    title,
  });

  if (projectExists) {
    throw new ApiError(409, "project name already exists!");
  }

  const coverImage = req.files?.coverImage[0]?.path;
  const projectImages = req.files?.projectImages;

  const uploadedCoverImage = await uploadToCloudinary(coverImage);
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
    .status(200)
    .json(new ApiRes(200, newProject, "project created succesfully!"));
});

export { addProject };
