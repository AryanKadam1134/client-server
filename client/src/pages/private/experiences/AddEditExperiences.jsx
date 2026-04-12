import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import { Trash2, Loader, ChevronLeft, ChevronRight, Image } from "lucide-react";

import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import DragDropUpload from "../../../components/ui/DragDropUpload";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";
import CustomMultiSelect from "../../../components/ui/CustomMultiSelect";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../../api";

import useSkillsList from "../../../hooks/useSkillsList";
import useVisibilities from "../../../hooks/useVisibilities";
import useEmploymentTypes from "../../../hooks/useEmploymentTypes";

export default function AddEditExperiences() {
  const { skillsList } = useSkillsList();
  const { visibilities } = useVisibilities();
  const { employmentTypes } = useEmploymentTypes();

  const { experienceId } = useParams();

  const [imagesUploading, setImagesUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      sortOrder: 0,
      featured: true,
      visibility: "public",
      position: [
        {
          role: "",
          startDate: "",
          endDate: "",
          present: null,
        },
      ],
      highLights: [""],
    },
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "highLights",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "position",
  });
  const organizationImage = useWatch({ control, name: "organizationImage" });

  const formatDate = (date) => {
    return date ? dayjs(date).format("YYYY-MM-DD") : "";
  };

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

  const fetchExperience = async () => {
    try {
      const res = await apiEndpoints.getExperience(experienceId);

      const data = res.data;

      reset({
        ...data,
        position: data?.position?.map((pos) => ({
          ...pos,
          startDate: formatDate(pos?.startDate),
          endDate: formatDate(pos?.endDate),
        })),
        highLights: data?.highLights || [""],
      });
      console.log("Experience: ", data);
    } catch (error) {
      console.error("Error fetching Experience: ", error);
    }
  };

  const addUpdateExperience = async (payload) => {
    try {
      let res;
      if (experienceId) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        updatedData.highLights = payload.highLights;

        console.log("Updated Data: ", updatedData);
        res = await apiEndpoints.updateExperience(experienceId, updatedData);
      } else {
        res = await apiEndpoints.addExperience(payload);
      }

      const data = res.data;

      if (experienceId) fetchExperience();
      console.log("Experience Saved: ", data);
    } catch (error) {
      console.error("Error saving Experience: ", error);
    }
  };

  // Can uplaod multiple
  const updateOrganizationImage = async (files) => {
    const file = files[0];

    setImagesUploading(true);

    try {
      const formData = new FormData();

      formData.append("organizationImage", file);

      await apiEndpoints.updateOrganizationImage(experienceId, formData);

      fetchExperience();
      console.log("Images uploaded successfully!");
    } catch (error) {
      console.error("Error updating Experience Images: ", error);
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteOrganizationImage = async () => {
    try {
      await apiEndpoints.deleteOrganizationImage(experienceId);

      fetchExperience();
      console.log("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting Organization Image: ", error);
    }
  };

  useEffect(() => {
    if (!experienceId) return;
    fetchExperience();
  }, [experienceId]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateExperience)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Organization Name */}
      <LabelInput
        id="organization"
        label="Organization Name"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="organization"
          type="text"
          placeholder={`Enter Organization Name`}
          {...register("organization", {
            required: "Organization Name is required!",
          })}
          error={errors?.organization}
        />
      </LabelInput>

      {/* Employment Type */}
      <LabelInput
        id="employmentType"
        label="Employment Type"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <Controller
          name="employmentType"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="employmentType"
              placeholder="Select Employment Type"
              options={employmentTypes}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Organization Size */}
      <LabelInput
        id="organizationSize"
        label="Organization Size"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="organizationSize"
          type="text"
          placeholder={`e,g, 10-20`}
          {...register("organizationSize")}
          error={errors?.organizationSize}
        />
      </LabelInput>

      {/* Website */}
      <LabelInput
        id="organizationWebsite"
        label="Website"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="organizationWebsite"
          type="text"
          placeholder={`Enter Website`}
          {...register("organizationWebsite")}
          error={errors?.organizationWebsite}
        />
      </LabelInput>

      {/* Description */}
      <LabelInput
        id="description"
        label="Description"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomTextArea
          id="description"
          type="text"
          placeholder={`Enter Description`}
          {...register("description")}
          error={errors?.description}
        />
      </LabelInput>

      {/* Tech Stack */}
      <LabelInput
        id="techStack"
        label="Tech Stack"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <Controller
          name="techStack"
          control={control}
          render={({ field }) => (
            <CustomMultiSelect
              id="techStack"
              placeholder="Select Tech Stack"
              options={skillsList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Location */}
      <LabelInput
        id="location"
        label="Location"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="location"
          type="text"
          placeholder={`Enter Location`}
          {...register("location")}
          error={errors?.location}
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

      <div className="col-span-12 flex flex-col gap-3 p-3 w-full border border-gray-500 rounded">
        <div className="flex items-center justify-between">
          <p className="font-medium text-lg">
            Highlights (Your Highlights inside the company)
          </p>

          <button
            type="button"
            onClick={() => appendHighlight("")}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Add Highlight
          </button>
        </div>

        {highlightFields.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="w-full">
              <CustomInput
                placeholder={`Highlight ${idx + 1}`}
                {...register(`highLights.${idx}`, {
                  required: "Highlight is required",
                })}
                error={errors?.highLights?.[idx]}
              />
            </div>

            <button
              type="button"
              onClick={() => removeHighlight(idx)}
              className="p-2 bg-red-500 text-white rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="col-span-12 flex flex-col gap-3 p-3 w-full border border-gray-500 rounded">
        <div className="flex items-center justify-between">
          <p className="font-medium text-lg">Positions</p>

          <button
            type="button"
            onClick={() =>
              append({ role: "", startDate: "", endDate: "", present: false })
            }
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Add Highlight
          </button>
        </div>

        {fields?.map((data, idx) => (
          <div key={data?.role || idx} className="grid grid-cols-12 gap-6">
            <LabelInput
              id={`position-${idx}.role`}
              label="Role"
              colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <CustomInput
                id={`position-${idx}.role`}
                placeholder={`Enter Role`}
                {...register(`position.${idx}.role`)}
                error={errors?.position?.[idx]?.role}
              />
            </LabelInput>

            {/* Start Date */}
            <LabelInput
              id={`position-${idx}.startDate`}
              label="Start Date"
              colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
              required
            >
              <CustomDatePicker
                id={`position-${idx}.startDate`}
                placeholder={`Enter Start Date`}
                {...register(`position.${idx}.startDate`, {
                  required: "Start Date is required!",
                })}
                error={errors?.position?.[idx]?.startDate}
              />
            </LabelInput>

            {/* End Date */}
            <LabelInput
              id={`position-${idx}.endDate`}
              label="End Date"
              colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <CustomDatePicker
                id={`position-${idx}.endDate`}
                placeholder={`Enter End Date`}
                {...register(`position.${idx}.endDate`)}
                error={errors?.position?.[idx]?.endDate}
              />
            </LabelInput>

            {/* Present */}
            <LabelInput
              id={`position-${idx}.present`}
              label="Present"
              colSpan="col-span-9 sm:col-span-4 lg:col-span-2"
              type="checkbox"
            >
              <input
                id={`position-${idx}.present`}
                type="checkbox"
                placeholder={`Enter Present`}
                {...register(`position.${idx}.present`)}
                error={errors?.position?.[idx]?.present}
              />
            </LabelInput>

            <button
              type="button"
              onClick={() => remove(idx)}
              className="w-fit h-fit self-center col-span-3 sm:col-span-2 lg:col-span-1 p-2 bg-red-500 text-white rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Image  */}
      <LabelInput
        id="upload"
        label="Upload Image"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <DragDropUpload
          id="upload"
          accept="image/*"
          loading={imagesUploading}
          onChange={(files) => updateOrganizationImage(files)}
        />
      </LabelInput>

      {/* Cover Image */}
      <LabelInput
        label="Cover Image"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <div className="h-[120px] rounded overflow-hidden border border-gray-400">
          <img
            src={organizationImage?.url}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      </LabelInput>

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
