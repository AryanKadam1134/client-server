import { SkillCategory } from "../../models/skillCategory.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRes from "../../utils/ApiRes.js";
import asynchandler from "../../utils/asynchandler.js";

const addSkillCategory = asynchandler(async (req, res) => {
  const { name, visibility, sortOrder } = req.body;

  const fields = {};

  if (!name) {
    throw new ApiError(400, "name is required!");
  } else {
    fields.name = name;
  }
  if (typeof visibility == "boolean") fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const category = await SkillCategory.findOne({
    owner: req.user?._id,
    name,
  });

  if (category) {
    throw new ApiError(409, "this category already exists!");
  }

  const newCategory = await SkillCategory.create({
    owner: req.user?._id,
    ...fields,
  });

  if (!newCategory) {
    throw new ApiError(500, "couldn't create category!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, newCategory, "category created succesfully!"));
});

const updateSkillCategory = asynchandler(async (req, res) => {
  const categoryId = req.params?.categoryId;

  const { name, visibility, sortOrder } = req.body;

  if (!categoryId) {
    throw new ApiError(404, "categoryId is required!");
  }

  const category = await SkillCategory.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "category not found!");
  }

  const fields = {};

  if (name) fields.name = name;
  if (typeof visibility == "boolean") fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const updatedCategory = await SkillCategory.findByIdAndUpdate(
    categoryId,
    {
      $set: fields,
    },
    { new: true },
  );

  if (!updatedCategory) {
    throw new ApiError(500, "couldn't updated category!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedCategory, "category updated succesfully!"));
});

const deleteSkillCategory = asynchandler(async (req, res) => {
  const categoryId = req.params?.categoryId;

  if (!categoryId) {
    throw new ApiError(404, "categoryId is required!");
  }

  const deleteCategory = await SkillCategory.findByIdAndDelete(categoryId);

  if (!deleteCategory) {
    throw new ApiError(404, "couldn't delete category!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "category deleted successfully!"));
});

export { addSkillCategory, updateSkillCategory, deleteSkillCategory };
