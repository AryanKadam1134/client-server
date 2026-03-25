import { Certificate } from "../../models/certificate.model";
import ApiError from "../../utils/ApiError";
import asynchandler from "../../utils/asynchandler";
import { parseBoolean } from "../../utils/parseBoolean";

const addCertificate = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    title,
    issuer,
    certificateUrl,
    credentialId,
    credentialUrl,
    issueDate,
    expiryDate,
    skills,
    featured,
    visibility,
    sortOrder,
  } = req.body;

  if (!title) {
    throw new ApiError(400, "title is required!");
  }

  if (!issuer) {
    throw new ApiError(400, "issuer is required!");
  }

  const certificateExists = await Certificate.findOne({
    owner: loggedUserId,
    title,
  });

  if (certificateExists) {
    throw new ApiError(409, "certificate already exists!");
  }

  const field = {};

  field.title = title;
  field.issuer = issuer;

  if (certificateUrl) field.certificateUrl = certificateUrl;

  if (credentialId) field.credentialId = credentialId;
  if (credentialUrl) field.credentialUrl = credentialUrl;

  if (issueDate) field.issueDate = issueDate;
  if (expiryDate) field.expiryDate = expiryDate;

  if (skills?.length > 0)
    field.skills = Array.isArray(skills) ? skills : JSON.parse(skills);

  if (featured !== undefined) field.featured = parseBoolean(featured);
  if (visibility !== undefined) field.visibility = parseBoolean(visibility);
  if (sortOrder !== undefined) field.sortOrder = Number(sortOrder);
});
