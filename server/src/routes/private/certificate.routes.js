import { Router } from "express";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getCertificateById } from "../../middlewares/certificate.middleware.js";

const certificateRoutes = Router();

certificateRoutes.use(verifyJWT);

certificateRoutes
  .route("/")
  .post(upload.single("certificateImage"), addCertificate);

certificateRoutes
  .route("/:certificateId")
  .patch(getCertificateById, addCertificate);

export default certificateRoutes;
