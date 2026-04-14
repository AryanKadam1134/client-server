import { Router } from "express";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getCertificateById } from "../../middlewares/certificate.middleware.js";

import {
  addCertificate,
  deleteCertificate,
  deleteCertificateImage,
  getAllCertificates,
  getCertificate,
  updateCertificate,
  updateCertificateImage,
} from "../../controllers/private/certificate.controller.js";

const certificateRoutes = Router();

certificateRoutes.use(verifyJWT);

certificateRoutes
  .route("/")
  .post(upload.single("certificateImage"), addCertificate)
  .get(getAllCertificates);

certificateRoutes
  .route("/:certificateId")
  .get(getCertificateById, getCertificate)
  .patch(getCertificateById, updateCertificate)
  .delete(getCertificateById, deleteCertificate);

certificateRoutes
  .route("/:certificateId/certificate-image")
  .patch(
    getCertificateById,
    upload.single("certificateImage"),
    updateCertificateImage,
  )
  .delete(getCertificateById, deleteCertificateImage);

export default certificateRoutes;
