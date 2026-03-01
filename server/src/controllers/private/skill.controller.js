import { Skill } from "../../models/skill.model.js";
import { SkillCategory } from "../../models/skillCategory.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";

const addSkill = asynchandler(async (req, res) => {
  const { name, description, categoryId, level, visibility, sortOrder } =
    req.body;

  const loggedUserId = req.user?._id;

  const fields = {};

  if (!name) {
    throw new ApiError(400, "name is required!");
  } else {
    fields.name = name;
  }

  if (categoryId) {
    await SkillCategory.findById(categoryId)
      .then(() => (fields.categoryId = categoryId))
      .catch((error) => {
        throw new ApiError(404, "category doesn't exists!", error);
      });
  }

  if (description) fields.description = description;
  if (level) fields.level = level;
  if (typeof visibility == "boolean") fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const skillExists = await Skill.findOne({
    owner: loggedUserId,
    name,
  });

  if (skillExists) {
    throw new ApiError(404, "skill already exists!");
  }

  const newSkill = await Skill.create({
    owner: loggedUserId,
    ...fields,
  });

  if (!newSkill) {
    throw new ApiError(404, "couldn't create skill!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, newSkill, "skill added successfully!"));
});

export { addSkill };
