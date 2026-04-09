import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useVisibilities from "../../hooks/useVisibilities";

export default function AddEditProject() {
  const { visibilities } = useVisibilities();

  const { projectId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      sortOrder: 0,
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

  const fetchProject = async () => {
    try {
      const res = await apiEndpoints.getProject(projectId);

      const data = res.data;

      reset(data);
      console.log("Project: ", data);
    } catch (error) {
      console.error("Error fetching Project: ", error);
    }
  };

  const addUpdateProject = async (payload) => {
    try {
      let res;
      if (projectId) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await apiEndpoints.updateProject(projectId, updatedData);
      } else {
        res = await apiEndpoints.addProject(payload);
      }

      const data = res.data;

      if (projectId) fetchProject();
      console.log("Project Saved: ", data);
    } catch (error) {
      console.error("Error saving Project: ", error);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchProject();
  }, [projectId]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateProject)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Project Name */}
      <LabelInput
        id="title"
        label="Project Name"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="title"
          type="text"
          placeholder={`Enter Project Name`}
          {...register("title")}
          error={errors?.title}
        />
      </LabelInput>

      {/* Live Link */}
      <LabelInput
        id="liveLink"
        label="Live Link"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="liveLink"
          type="text"
          placeholder={`Link`}
          {...register("liveLink")}
          error={errors?.liveLink}
        />
      </LabelInput>

      {/* Github Link */}
      <LabelInput
        id="githubLink"
        label="Github Link"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="githubLink"
          type="text"
          placeholder={`Enter Github Link`}
          {...register("githubLink")}
          error={errors?.githubLink}
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
          placeholder={`Enter Project Sort Order`}
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
