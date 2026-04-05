import React, { Fragment, useEffect } from "react";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Select } from "antd";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomSelect from "../../components/ui/CustomSelect";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useSkillLevels from "../../hooks/useSkillLevels";
import useVisibilities from "../../hooks/useVisibilities";
import useSkillCategories from "../../hooks/useSkillCategories";

const TECH_SKILLS = [
  { title: "HTML5", category: "Frontend" },
  { title: "CSS3", category: "Frontend" },
  { title: "JavaScript (ES6+)", category: "Frontend" },
  { title: "TypeScript", category: "Frontend" },
  { title: "React", category: "Frontend" },
  { title: "Vue.js", category: "Frontend" },
  { title: "Angular", category: "Frontend" },
  { title: "Svelte", category: "Frontend" },
  { title: "Next.js", category: "Frontend" },
  { title: "Tailwind CSS", category: "Frontend" },
  { title: "Sass/SCSS", category: "Frontend" },
  { title: "Redux / Context API", category: "State Management" },
  { title: "Node.js", category: "Backend" },
  { title: "Express.js", category: "Backend" },
  { title: "Python", category: "Backend" },
  { title: "Django", category: "Backend" },
  { title: "Ruby on Rails", category: "Backend" },
  { title: "PHP", category: "Backend" },
  { title: "Go (Golang)", category: "Backend" },
  { title: "GraphQL", category: "API" },
  { title: "REST API", category: "API" },
  { title: "PostgreSQL", category: "Database" },
  { title: "MongoDB", category: "Database" },
  { title: "MySQL", category: "Database" },
  { title: "Redis", category: "Database" },
  { title: "Git / GitHub", category: "Tools" },
  { title: "Docker", category: "DevOps" },
  { title: "Kubernetes", category: "DevOps" },
  { title: "AWS / Azure / GCP", category: "Cloud" },
  { title: "Vercel / Netlify", category: "Deployment" },
  { title: "CI/CD Pipelines", category: "DevOps" },
  { title: "Unit Testing (Jest/Cypress)", category: "Testing" },
  { title: "Web Performance Optimization", category: "Optimization" },
  { title: "SEO Fundamentals", category: "Marketing" },
  { title: "Web Accessibility (A11y)", category: "Frontend" },
];

const SKILLS = TECH_SKILLS.map((app) => ({
  value: app.title,
  label: app.title,
}));

export default function Skills() {
  const { visibilities } = useVisibilities();
  const { skillLevels } = useSkillLevels();
  const { categoriesFilter } = useSkillCategories();

  const {
    register,
    reset,
    control,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const fetchSkills = async () => {
    try {
      const res = await apiEndpoints.getSkills();

      const data = res.data;

      reset({ skills: data });
      console.log("User Skills: ", data);
    } catch (error) {
      console.error("Error fetching User Skills: ", error);
    }
  };

  const addSkill = async (payload) => {
    try {
      const res = await apiEndpoints.addSkill(payload);

      const data = res.data;

      fetchSkills();
      console.log("Skill Created: ", data);
    } catch (error) {
      console.error("Error creating Skill: ", error);
    }
  };

  const updateSkill = async (payload) => {
    try {
      await apiEndpoints.updateSkill(payload?._id, payload);

      fetchSkills();
    } catch (error) {
      console.error("Error updating Skill: ", error);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await apiEndpoints.deleteSkill(id);

      fetchSkills();
    } catch (error) {
      console.error("Error deleting Skill: ", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 text-sm">
      {fields.map((item, index) => (
        <div
          key={item._id || index}
          className="col-span-4 flex flex-col gap-6 p-5 bg-white border border-gray-500 rounded-md shadow-lg"
        >
          <LabelInput id={`skills.${index}.name`} label="Skill Name" required>
            <CustomInput
              id={`skills.${index}.name`}
              type="text"
              placeholder={`Enter Platform name`}
              {...register(`skills.${index}.name`)}
              error={errors.skills?.[index]?.name}
            />
          </LabelInput>

          <LabelInput
            id={`skills.${index}.categoryId`}
            label="Category"
            className="w-full"
          >
            <Controller
              name={`skills.${index}.categoryId`}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  id={`skills.${index}.categoryId`}
                  placeholder="Select Category"
                  options={categoriesFilter}
                  value={field.value}
                  onChange={field.onChange} // send value to hook form
                />
              )}
            />
          </LabelInput>

          <LabelInput id={`skills.${index}.level`} label="Level" required>
            <CustomRadioButtons
              id={`skills.${index}.level`}
              name="level"
              options={skillLevels}
              {...register(`skills.${index}.level`, {
                required: "Visibility is required!",
              })}
              error={errors.skills?.[index]?.level}
            />
          </LabelInput>

          <LabelInput id={`skills.${index}.sortOrder`} label="Sort Order">
            <CustomInput
              id={`skills.${index}.sortOrder`}
              type="number"
              min={0}
              placeholder={`Enter ${item.name} Sort Order`}
              {...register(`skills.${index}.sortOrder`, { min: 0 })}
              error={errors.skills?.[index]?.sortOrder}
            />
          </LabelInput>

          <div className="flex items-center justify-between gap-2">
            <LabelInput
              id={`skills.${index}.visibility`}
              label="Visibility"
              className="flex-1"
              required
            >
              <CustomRadioButtons
                id={`skills.${index}.visibility`}
                name="visibility"
                options={visibilities}
                {...register(`skills.${index}.visibility`, {
                  required: "Visibility is required!",
                })}
                error={errors.skills?.[index]?.visibility}
              />
            </LabelInput>

            <CustomButton
              type="button"
              onClick={() => (item._id ? deleteSkill(item._id) : remove(index))}
              bg_prop="bg-red-500 hover:bg-red-600"
            >
              Remove
            </CustomButton>

            {/* Add button */}
            {!item._id && (
              <CustomButton
                type="button"
                onClick={() => addSkill(getValues(`skills.${index}`))}
                bg_prop="bg-green-500 hover:bg-green-600"
              >
                Add
              </CustomButton>
            )}

            {/* Update Button */}
            {item?._id &&
              dirtyFields?.skills?.[index] &&
              Object.values(dirtyFields?.skills?.[index])?.some((v) => v) && (
                <CustomButton
                  type="button"
                  onClick={() => updateSkill(getValues(`skills.${index}`))}
                  bg_prop="bg-blue-500 hover:bg-blue-600"
                >
                  Update
                </CustomButton>
              )}
          </div>
        </div>
      ))}

      <div className="col-span-4 flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-500 rounded-md shadow-lg">
        <div
          onClick={() =>
            append({
              name: "",
              categoryId: "",
              level: "",
              visibility: "public", // or default value
              sortOrder: fields?.length,
            })
          }
          className="flex flex-col items-center justify-center gap-1 w-full h-full
          text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border-2 border-gray-500 border-dashed cursor-pointer transition-colors"
        >
          <Plus size={24} />
          Add Custom Platform <br />
        </div>

        <p>OR</p>

        <LabelInput id="platfrom" label="Select Platfrom" className="w-full">
          <CustomSelect
            placeholder="Select Platfrom"
            options={[{ value: "Select Platfrom", label: "Select" }, ...SKILLS]}
            value="Select Platfrom"
            onChange={(value) =>
              append({
                name: value, // ✅ correct
                categoryId: "",
                level: "",
                visibility: "public",
                sortOrder: fields?.length,
              })
            }
          />
        </LabelInput>
      </div>
    </div>
  );
}
