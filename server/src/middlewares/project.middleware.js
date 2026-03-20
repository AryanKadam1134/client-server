import { Project } from "../models/project.model";

import asynchandler from "../utils/asynchandler";

export const getProjectById = asynchandler(async (req, resizeBy, next) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required!");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new ApiError(404, "project not found!");
  }

  req.project = projectExists;

  next();
});
