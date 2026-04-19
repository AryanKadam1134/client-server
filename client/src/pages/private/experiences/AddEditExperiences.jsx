import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import { Trash2, Loader, ExternalLink, Plus } from "lucide-react";

import FieldError from "../../../components/ui/FieldError";
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
import useLocationTypesList from "../../../hooks/useLocationTypesList";

export default function AddEditExperiences() {
  const { skillsList } = useSkillsList();
  const { visibilities } = useVisibilities();
  const { employmentTypes } = useEmploymentTypes();
  const { locationTypesList } = useLocationTypesList();

  const { experienceId } = useParams();

  const [id, setId] = useState(experienceId);

  const [imagesUploading, setImagesUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(false);

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
      positions: [
        {
          role: "",
          startDate: "",
          endDate: "",
          present: null,
        },
      ],
      highlights: [""],
    },
    mode: "onChange",
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "highlights",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "positions",
  });
  const organizationImage = useWatch({ control, name: "organizationImage" });
  const organizationWebsite = useWatch({
    control,
    name: "organizationWebsite",
  });

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
      const res = await apiEndpoints.getExperience(id);

      const data = res.data;

      reset({
        ...data,
        positions: data?.positions?.map((pos) => ({
          ...pos,
          startDate: formatDate(pos?.startDate),
          endDate: formatDate(pos?.endDate),
        })),
        highlights: data?.highlights || [""],
      });
      console.log("Experience: ", data);
    } catch (error) {
      console.error("Error fetching Experience: ", error);
    }
  };

  const addUpdateExperience = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        updatedData.highlights = payload.highlights;

        res = await apiEndpoints.updateExperience(id, updatedData);
      } else {
        res = await apiEndpoints.addExperience(payload);
      }

      const data = res.data;

      setId(data?._id);
      if (data?._id) fetchExperience();
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

      await apiEndpoints.updateOrganizationImage(id, formData);

      fetchExperience();
      console.log("Images uploaded successfully!");
    } catch (error) {
      console.error("Error updating Experience Images: ", error);
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteOrganizationImage = async () => {
    setImageDeleting(true);
    try {
      await apiEndpoints.deleteOrganizationImage(id);

      fetchExperience();
      console.log("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting Organization Image: ", error);
    } finally {
      setImageDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchExperience();
  }, [id]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateExperience)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Organization Name */}
      <LabelInput
        id="organization"
        label="Organization Name"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="organization"
          type="text"
          placeholder="Company Name"
          {...register("organization", {
            required: "Organization Name is required!",
          })}
          error={errors?.organization}
        />

        <FieldError error={errors.organization?.message} />
      </LabelInput>

      {/* Employment Type */}
      <LabelInput
        id="employmentType"
        label="Employment Type"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <Controller
          name="employmentType"
          control={control}
          rules={{ required: "Employment Type is required!" }}
          render={({ field }) => (
            <CustomSelect
              id="employmentType"
              placeholder="e.g. Full Time, Part Time"
              options={employmentTypes}
              value={field.value}
              onChange={field.onChange}
              error={errors?.employmentType} // send value to hook form
            />
          )}
        />

        <FieldError error={errors.employmentType?.message} />
      </LabelInput>

      {/* Organization Size */}
      <LabelInput
        id="organizationSize"
        label="Organization Size"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="organizationSize"
          type="text"
          placeholder="e.g. 10-20"
          {...register("organizationSize")}
          error={errors?.organizationSize}
        />
      </LabelInput>

      {/* Website */}
      <LabelInput
        id="organizationWebsite"
        label="Company's Website"
        colSpan="col-span-12 sm:col-span-6"
        attachment={
          organizationWebsite && (
            <a
              href={organizationWebsite}
              target="_blank"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              <ExternalLink size={13} /> <p>Visit Link</p>
            </a>
          )
        }
      >
        <CustomInput
          id="organizationWebsite"
          type="text"
          placeholder="Company Website"
          {...register("organizationWebsite", {
            pattern: {
              value: /^https:\/\/.+$/,
              message: "URL must start with https://",
            },
          })}
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
          placeholder="Enter Description"
          {...register("description", {
            maxLength: {
              value: 1000,
              message: "Max 1000 characters allowed!",
            },
          })}
          error={errors?.description}
        />

        <FieldError error={errors.description?.message} />
      </LabelInput>

      {/* Tech Stack */}
      <LabelInput
        id="techStack"
        label="Tech Stack"
        colSpan="col-span-12 sm:col-span-6"
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
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="location"
          type="text"
          placeholder="Comapany Location"
          {...register("location")}
          error={errors?.location}
        />
      </LabelInput>

      {/* Location Type */}
      <LabelInput
        id="locationType"
        label="Location Type"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <Controller
          name="locationType"
          control={control}
          rules={{ required: "Location Type is required!" }}
          render={({ field }) => (
            <CustomSelect
              id="locationType"
              placeholder="e.g. On Site, Remote"
              options={locationTypesList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
              error={errors?.locationType}
            />
          )}
        />

        <FieldError error={errors.locationType?.message} />
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

        <FieldError error={errors.visibility?.message} />
      </LabelInput>

      {/* Highlights */}
      <div className="col-span-12 flex flex-col gap-3 p-3 w-full border border-gray-500 rounded">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-[16px]">
            Highlights{" "}
            <span className="font-normal">
              (your highlights inside the company)
            </span>
          </p>

          <button
            type="button"
            onClick={() => appendHighlight("")}
            className="hidden sm:block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer transition-all"
          >
            Add Highlight
          </button>

          <button
            type="button"
            onClick={() => appendHighlight("")}
            className="block sm:hidden p-1 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer transition-all"
          >
            <Plus />
          </button>
        </div>

        <div className="border-b-2 border-gray-400" />

        {highlightFields.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-6"
          >
            <div className="w-full">
              <CustomInput
                placeholder={`Highlight ${idx + 1}`}
                {...register(`highlights.${idx}`, {
                  required: "Highlight is required",
                })}
                error={errors?.highlights?.[idx]}
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

      {/* Positions */}
      <div className="col-span-12 flex flex-col gap-3 p-3 w-full border border-gray-500 rounded">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-[16px]">Positions / Posts</p>

          <button
            type="button"
            onClick={() =>
              append({ role: "", startDate: "", endDate: "", present: false })
            }
            className="hidden sm:block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer transition-all"
          >
            Add Position
          </button>

          <button
            type="button"
            onClick={() =>
              append({ role: "", startDate: "", endDate: "", present: false })
            }
            className="block sm:hidden p-1 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer transition-all"
          >
            <Plus />
          </button>
        </div>

        <div className="border-b-2 border-gray-400" />

        <div className="flex flex-col gap-6">
          {fields?.map((data, idx) => (
            <>
              <div key={data?.role || idx} className="grid grid-cols-12 gap-6">
                <LabelInput
                  id={`positions-${idx}.role`}
                  label="Role"
                  colSpan="col-span-12 sm:col-span-6"
                >
                  <CustomInput
                    id={`positions-${idx}.role`}
                    placeholder="Job Role"
                    {...register(`positions.${idx}.role`, {
                      required: "Role is required!",
                    })}
                    error={errors?.positions?.[idx]?.role}
                  />

                  <FieldError error={errors.positions?.[idx]?.role?.message} />
                </LabelInput>

                {/* Start Date */}
                <LabelInput
                  id={`positions-${idx}.startDate`}
                  label="Start Date"
                  colSpan="col-span-12 sm:col-span-6"
                  required
                >
                  <CustomDatePicker
                    id={`positions-${idx}.startDate`}
                    placeholder="Select Date"
                    {...register(`positions.${idx}.startDate`, {
                      required: "Start Date is required!",
                    })}
                    error={errors?.positions?.[idx]?.startDate}
                  />

                  <FieldError
                    error={errors.positions?.[idx]?.startDate?.message}
                  />
                </LabelInput>

                {/* End Date */}
                <LabelInput
                  id={`positions-${idx}.endDate`}
                  label="End Date"
                  colSpan="col-span-12 sm:col-span-6"
                >
                  <CustomDatePicker
                    id={`positions-${idx}.endDate`}
                    placeholder="Select Date"
                    {...register(`positions.${idx}.endDate`)}
                    error={errors?.positions?.[idx]?.endDate}
                  />
                </LabelInput>

                {/* Present */}
                <LabelInput
                  id={`positions-${idx}.present`}
                  label="Currently working on this position"
                  colSpan="col-span-9 sm:col-span-4 lg:col-span-5"
                  type="checkbox"
                >
                  <input
                    id={`positions-${idx}.present`}
                    type="checkbox"
                    {...register(`positions.${idx}.present`)}
                    error={errors?.positions?.[idx]?.present}
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

              <div className="last:hidden border-b-2 border-dashed border-gray-400"></div>
            </>
          ))}
        </div>
      </div>

      {id && (
        <>
          {" "}
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
            <div className="relative group h-[120px] rounded overflow-hidden border border-gray-400">
              {/* Loader */}
              {imageDeleting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <Loader size={24} className="animate-spin text-white" />
                </div>
              )}

              <img
                src={organizationImage?.url}
                alt=""
                className="w-full h-full object-contain"
              />

              {/* Delete Button (Hover Only) */}
              <button
                type="button"
                onClick={deleteOrganizationImage}
                className="absolute top-2 right-2 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </LabelInput>
        </>
      )}

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
