import { Router } from "express";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getCertificateById } from "../../middlewares/certificate.middleware.js";

import {
  addCertificate,
  updateCertificate,
  updateCertificateImage,
} from "../../controllers/private/certificate.controller.js";

const certificateRoutes = Router();

certificateRoutes.use(verifyJWT);

certificateRoutes
  .route("/")
  .post(upload.single("certificateImage"), addCertificate);

certificateRoutes
  .route("/:certificateId")
  .patch(getCertificateById, updateCertificate);

certificateRoutes
  .route("/:certificateId/certificate-image")
  .patch(getCertificateById, updateCertificateImage);

export default certificateRoutes;
