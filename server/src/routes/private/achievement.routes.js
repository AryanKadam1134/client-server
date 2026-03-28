import { Router } from "express";

import {
  addAchievement,
  deleteAchievement,
  deleteAchievementImage,
  getAllAchievement,
  updateAchievement,
  updateAchievementImages,
} from "../../controllers/private/achievement.controller.js";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getAchievementById } from "../../middlewares/achievement.middleware.js";

const achievementRouter = Router();

achievementRouter.use(verifyJWT);

achievementRouter
  .route("/")
  .post(upload.array("achievementImages", 5), addAchievement)
  .get(getAllAchievement);

achievementRouter
  .route("/:achievementId")
  .patch(getAchievementById, updateAchievement)
  .delete(getAchievementById, deleteAchievement);

achievementRouter
  .route("/:achievementId/achievement-images")
  .patch(
    getAchievementById,
    upload.array("achievementImages", 5),
    updateAchievementImages,
  );

achievementRouter
  .route("/:achievementId/achievement-images/:imagePublicId")
  .delete(getAchievementById, deleteAchievementImage);

export default achievementRouter;
