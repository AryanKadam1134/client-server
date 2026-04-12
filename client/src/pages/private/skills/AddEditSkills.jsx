import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../../api";

import useSkillLevels from "../../../hooks/useSkillLevels";
import useVisibilities from "../../../hooks/useVisibilities";
import useCategoriesList from "../../../hooks/useCategoriesList";

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

export default function AddEditSkills() {
  const { visibilities } = useVisibilities();
  const { skillLevels } = useSkillLevels();
  const { categoriesList } = useCategoriesList();

  const { skillId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      sortOrder: 0,
      visibility: "public",
    },
  });

  const getUpdatedFields = (data, dirtyFields) => {
    const updated = {};

    for (const key in dirtyFields) {
      if (
        typeof dirtyFields[key] === "object" &&
        !Array.isArray(dirtyFields[key])
      ) {
        updated[key] = getUpdatedFields(data[key], dirtyFields[key]);
      } else {
        updated[key] = data[key];
      }
    }

    return updated;
  };

  const fetchSkill = async () => {
    try {
      const res = await apiEndpoints.getSkill(skillId);

      const data = res.data;

      reset(data);
      console.log("Skill: ", data);
    } catch (error) {
      console.error("Error fetching Skill: ", error);
    }
  };

  const addUpdateSkill = async (payload) => {
    try {
      let res;
      if (skillId) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await apiEndpoints.updateSkill(skillId, updatedData);
      } else {
        res = await apiEndpoints.addSkill(payload);
      }

      const data = res.data;

      if (skillId) fetchSkill();
      console.log("Skill Saved: ", data);
    } catch (error) {
      console.error("Error saving Skill: ", error);
    }
  };

  useEffect(() => {
    if (!skillId) return;
    fetchSkill();
  }, [skillId]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateSkill)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <CustomSelect
          id="categoryId"
          placeholder="Select Category"
          options={SKILLS}
          value={null}
          onChange={(value) => reset({ name: value })} // send value to hook form
        />
      </div>

      <div className="hidden sm:block col-span-9"></div>

      {/* Skill Name */}
      <LabelInput
        id="name"
        label="Skill Name"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="name"
          type="text"
          placeholder={`Enter Skill Name`}
          {...register("name", {
            required: "Skill Name is required!",
          })}
          error={errors?.name}
        />
      </LabelInput>

      {/* Skill Category */}
      <LabelInput
        id="categoryId"
        label="Category"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        className="w-full"
      >
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="categoryId"
              placeholder="Select Category"
              options={categoriesList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Skill Level */}
      <LabelInput
        id="level"
        label="Level"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        className="w-full"
        required
      >
        <Controller
          name="level"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomSelect
              id="level"
              placeholder="Select Level"
              options={skillLevels}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Sort Order */}
      <LabelInput
        id="sortOrder"
        label="Sort Order"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="sortOrder"
          type="number"
          min={0}
          placeholder={`Enter Skill Sort Order`}
          {...register("sortOrder", { valueAsNumber: true })}
          error={errors?.sortOrder}
        />
      </LabelInput>

      {/* Visibility  */}
      <LabelInput
        id="visibility"
        label="Visibility"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomRadioButtons
          id="visibility"
          name="visibility"
          options={visibilities}
          {...register("visibility", {
            required: "Visibility is required!",
          })}
          error={errors?.visibility}
        />
      </LabelInput>

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
