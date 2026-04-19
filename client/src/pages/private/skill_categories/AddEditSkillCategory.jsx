import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import FieldError from "../../../components/ui/FieldError";
import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

export default function AddEditSkillCategory() {
  const { visibilities } = useVisibilities();

  const { categoryId } = useParams();

  const [id, setId] = useState(categoryId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      sortOrder: 0,
      visibility: "public",
    },
    mode: "onChange",
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

  const fetchSkillCategory = async () => {
    try {
      const res = await apiEndpoints.getSkillCategory(id);

      const data = res.data;

      reset(data);
      console.log("Skill Category: ", data);
    } catch (error) {
      console.error("Error fetching Skill Category: ", error);
    }
  };

  const addUpdateSkillCategory = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await apiEndpoints.updateSkillCategory(id, updatedData);
      } else {
        res = await apiEndpoints.addSkillCategory(payload);
      }

      const data = res.data;

      setId(data?._id);
      if (data?._id) fetchSkillCategory();
      console.log("Skill Category Saved: ", data);
    } catch (error) {
      console.error("Error saving Skill Category: ", error);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchSkillCategory();
  }, [id]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateSkillCategory)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Category Name */}
      <LabelInput
        id="name"
        label="Category Name"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="name"
          type="text"
          placeholder="Category Name"
          {...register("name", {
            required: "Category Name is required!",
          })}
          error={errors?.name}
        />

        <FieldError error={errors.name?.message} />
      </LabelInput>

      {/* Sort Order */}
      <LabelInput
        id="sortOrder"
        label="Sort Order"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="sortOrder"
          type="number"
          min={0}
          placeholder="Sort Order"
          {...register("sortOrder", { valueAsNumber: true })}
          error={errors?.sortOrder}
        />
      </LabelInput>

      {/* Visibility  */}
      <LabelInput
        id="visibility"
        label="Visibility"
        colSpan="col-span-12 sm:col-span-6"
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
