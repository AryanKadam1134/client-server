import mongoose from "mongoose";
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

const updateSkill = asynchandler(async (req, res) => {
  const { name, description, categoryId, level, visibility, sortOrder } =
    req.body;

  const skillId = req.params?.skillId;

  if (!skillId) {
    throw new ApiError(400, "skillId is required!");
  }

  const skillExists = await Skill.findById(skillId);

  if (!skillExists) {
    throw new ApiError(404, "skill not found!");
  }

  const fields = {};

  if (categoryId) {
    await SkillCategory.findById(categoryId)
      .then(() => (fields.categoryId = categoryId))
      .catch((error) => {
        throw new ApiError(404, "category doesn't exists!", error);
      });
  }

  if (name) fields.name = name;
  if (description) fields.description = description;
  if (level) fields.level = level;
  if (typeof visibility == "boolean") fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const updatedSkill = await Skill.findByIdAndUpdate(
    skillId,
    {
      $set: fields,
    },
    { new: true },
  );

  if (!updatedSkill) {
    throw new ApiError(500, "couldn't update skill!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedSkill, "skill updated succesfully!"));
});

const deleteSkill = asynchandler(async (req, res) => {
  const skillId = req.params?.skillId;

  if (!skillId) {
    throw new ApiError(400, "skillId is required!");
  }

  const deletedSkill = await Skill.findByIdAndDelete(skillId);

  if (!deletedSkill) {
    throw new ApiError(500, "couldn't delete skill!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "skill deleted succesfully!"));
});

const getAllSkillWithCategory = asynchandler(async (req, res) => {
  const skills = await Skill.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "skillcategories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $addFields: {
        category: {
          $first: "$category",
        },
      },
    },
  ]);

  if (!skills) {
    throw new ApiError(500, "couldn't get all skills!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, skills, "skills fetched successfully!"));
});

export { addSkill, updateSkill, deleteSkill, getAllSkillWithCategory };
