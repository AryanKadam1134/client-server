import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadToCloudinary = async (localFilePath, resource_type) => {
  if (!localFilePath) return;

  try {
    const uploadedResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resource_type || "auto",
    });

    // console.log(
    //   "File has uploaded to cloudinary successfully: ",
    //   uploadedResult,
    // );

    fs.unlinkSync(localFilePath);

    return uploadedResult;
  } catch (error) {
    fs.unlinkSync(localFilePath);

    console.error("Error uplaoding the file to cloudinary: ", error);

    return null;
  }
};

const deleteFromCloudinary = async (file) => {
  const { public_id, resource_type } = file;

  if (!public_id) console.log("No Image is Provided!");

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || "image",
    });

    // console.log("Image deleted from Cloudinary successfully!");
    return result;
  } catch (error) {
    console.error("Error deleting file form Cloudinary: ", error);
    return null;
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
