import { Certificate } from "../../models/certificate.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import asynchandler from "../../utils/asynchandler.js";
import { parseBoolean } from "../../utils/parseBoolean.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

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

  const fields = {};

  fields.title = title;
  fields.issuer = issuer;

  if (certificateUrl) fields.certificateUrl = certificateUrl;

  if (credentialId) fields.credentialId = credentialId;
  if (credentialUrl) fields.credentialUrl = credentialUrl;

  if (issueDate) fields.issueDate = issueDate;
  if (expiryDate) fields.expiryDate = expiryDate;

  if (skills?.length > 0)
    fields.skills = Array.isArray(skills) ? skills : JSON.parse(skills);

  if (featured !== undefined) fields.featured = parseBoolean(featured);
  if (visibility !== undefined) fields.visibility = parseBoolean(visibility);
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  let uploadedCertificateImage;

  const certificateImage = req.file?.path;

  if (!(credentialUrl || certificateImage)) {
    throw new ApiError(
      400,
      "either credential URL or certificate image is required!",
    );
  }

  if (certificateImage)
    uploadedCertificateImage = await uploadToCloudinary(certificateImage);

  if (uploadedCertificateImage?.secure_url) {
    fields.certificateImage = {
      url: uploadedCertificateImage?.secure_url,
      public_id: uploadedCertificateImage?.public_id,
      resource_type: uploadedCertificateImage?.resource_type,
    };
  }

  const createdCertificate = await Certificate.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(201)
    .json(
      new ApiRes(201, createdCertificate, "certificate created successfully!"),
    );
});

const updateCertificate = asynchandler(async (req,res) => {
    
})

export { addCertificate };
