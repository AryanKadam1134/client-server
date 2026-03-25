import { Certificate } from "../../models/certificate.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import asynchandler from "../../utils/asynchandler.js";
import { parseBoolean } from "../../utils/parseBoolean.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.js";

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

const updateCertificate = asynchandler(async (req, res) => {
  const certificate = req.certificate;

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

  if (title) {
    const sameCertificateTitle = await Certificate.findOne({
      _id: { $ne: certificate._id },
      owner: certificate.owner,
      title,
    });

    if (sameCertificateTitle) {
      throw new ApiError(409, "certificate title already exists!");
    }
  }

  const fields = {};

  if (title) fields.title = title;
  if (issuer) fields.issuer = issuer;

  if (certificateUrl) fields.certificateUrl = certificateUrl;

  if (credentialId !== undefined) fields.credentialId = credentialId;
  if (credentialUrl !== undefined) fields.credentialUrl = credentialUrl;

  if (issueDate !== undefined) fields.issueDate = issueDate;
  if (expiryDate !== undefined) fields.expiryDate = expiryDate;

  if (skills?.length > 0)
    fields.skills = Array.isArray(skills) ? skills : JSON.parse(skills);

  if (featured !== undefined) fields.featured = parseBoolean(featured);
  if (visibility !== undefined) fields.visibility = parseBoolean(visibility);
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  if (!(certificate?.certificateImage?.public_id || credentialUrl)) {
    throw new ApiError(
      400,
      "either credential URL or certificate image is required!",
    );
  }

  Object.assign(certificate, fields);

  const updatedCertificate = await certificate.save();

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedCertificate, "certificate updated successfully!"),
    );
});

const updateCertificateImage = asynchandler(async (req, res) => {
  const certificate = req.certificate;

  const certificateImage = req.file?.path;

  if (!certificateImage) {
    throw new ApiError(400, "missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(certificateImage);

  if (!updatedImage?.secure_url) {
    throw new ApiError(500, "error while updating image on cloudinary!");
  }

  const updatedCertificate = await Certificate.findByIdAndUpdate(
    certificate.id,
    {
      $set: {
        certificateImage: {
          url: updatedImage?.secure_url,
          public_id: updatedImage?.public_id,
          resource_type: updatedImage?.resource_type,
        },
      },
    },
    { new: true },
  );

  if (certificate?.certificateImage?.public_id) {
    try {
      await deleteFromCloudinary(certificate.certificateImage);
    } catch (error) {
      console.error(
        "Error deleting certificateImage in updateCertificateImage: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        updatedCertificate,
        "certificateImage updated successfully!",
      ),
    );
});

export { addCertificate, updateCertificate, updateCertificateImage };
