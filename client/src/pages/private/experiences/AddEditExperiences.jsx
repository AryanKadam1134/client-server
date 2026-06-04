import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import {
  Trash2,
  Loader,
  ExternalLink,
  Plus,
  Link,
  Calendar,
} from "lucide-react";

import CoverImage from "../../../components/common/CoverImage";

import FieldError from "../../../components/ui/FieldError";
import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import ActionButton from "../../../components/ui/ActionButton";
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

import { useNotify } from "../../../context/NotificationContext";

export default function AddEditExperiences() {
  const { notify } = useNotify();

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
          isCurrent: null,
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

  const handleAppendHighlight = () => {
    appendHighlight("");
  };

  const handleAppendRole = () => {
    append({ role: "", startDate: "", endDate: "", isCurrent: false });
  };

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
      notify.msgError(error?.message || "Failed to fetch experience");
    }
  };

  const addUpdateExperience = async (payload) => {
    console.log("paylaod: ", payload);
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        updatedData.highlights = payload.highlights;

        res = await apiEndpoints.updateExperience(id, updatedData);
        notify.msgSuccess("Experience Updated!");
      } else {
        res = await apiEndpoints.addExperience(payload);
        notify.msgSuccess("Experience Saved!");
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Experience Saved: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to save experience");
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
      notify.msgSuccess("Organization Image Updated!");
      // console.log("Images uploaded successfully!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to update organization image");
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteOrganizationImage = async () => {
    setImageDeleting(true);
    try {
      await apiEndpoints.deleteOrganizationImage(id);

      fetchExperience();
      notify.msgSuccess("Organization Image Deleted!");
      // console.log("Image deleted successfully!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete organization image");
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
      {id && (
        <>
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
            <CoverImage
              image={organizationImage}
              imageDeleting={imageDeleting}
              deleteImage={deleteOrganizationImage}
            />
          </LabelInput>

          <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
        </>
      )}

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
          placeholder="Enter company name"
          {...register("organization", {
            required: "Organization name is required!",
            minLength: {
              value: 2,
              message: "Organization name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Organization name must not exceed 100 characters",
            },
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
          rules={{ required: "Employment type is required!" }}
          render={({ field }) => (
            <CustomSelect
              id="employmentType"
              placeholder="Select: Full-time, Part-time, Contract, Freelance"
              options={employmentTypes}
              value={field.value}
              onChange={field.onChange}
              error={errors?.employmentType}
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
          placeholder="e.g., 50-100 employees"
          {...register("organizationSize", {
            maxLength: {
              value: 50,
              message: "Organization size must not exceed 50 characters",
            },
          })}
          error={errors?.organizationSize}
        />
      </LabelInput>

      {/* Website */}
      <LabelInput
        id="organizationWebsite"
        label="Company Website"
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
          icon={Link}
          placeholder="https://example.com"
          {...register("organizationWebsite", {
            pattern: {
              value: /^(https:\/\/.+)?$/,
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
          placeholder="Describe your role, responsibilities, and key achievements..."
          {...register("description", {
            maxLength: {
              value: 1000,
              message: "Description must not exceed 1000 characters",
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
              placeholder="Select technologies used"
              options={skillsList}
              value={field.value}
              onChange={field.onChange}
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
          placeholder="e.g., San Francisco, CA"
          {...register("location", {
            maxLength: {
              value: 100,
              message: "Location must not exceed 100 characters",
            },
          })}
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
      <div className="col-span-12 flex flex-col gap-4 p-4 w-full bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary divide-y divide-light-border-primary dark:divide-dark-border-primary rounded-md shadow-sm">
        <div className="pb-4 flex items-center justify-between gap-3">
          <p className="font-medium text-[16px] text-light-text-primary dark:text-dark-text-primary">
            Highlights{" "}
            <span className="font-normal text-light-text-secondary dark:text-dark-text-secondary">
              (your highlights inside the company)
            </span>
          </p>

          <CustomButton
            type="button"
            variant="green"
            onClick={handleAppendHighlight}
            className="hidden sm:block"
          >
            Add Highlight
          </CustomButton>

          <ActionButton
            type="button"
            variant="green"
            icon={Plus}
            onClick={handleAppendHighlight}
            className="block sm:hidden"
          />
        </div>

        {highlightFields.map((item, idx) => (
          <div
            key={item.id}
            className="pb-4 flex items-center justify-between gap-6"
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

            <ActionButton
              type="button"
              variant="red"
              icon={Trash2}
              onClick={() => removeHighlight(idx)}
            />
          </div>
        ))}
      </div>

      {/* Positions */}
      <div className="col-span-12 flex flex-col gap-4 p-4 w-full bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary divide-y divide-light-border-primary dark:divide-dark-border-primary rounded-md shadow-sm">
        <div className="pb-4 flex items-center justify-between gap-3">
          <p className="font-medium text-[16px] text-light-text-primary dark:text-dark-text-primary">
            Positions / Posts
          </p>

          <CustomButton
            type="button"
            variant="green"
            onClick={handleAppendRole}
            className="hidden sm:block"
          >
            Add Position
          </CustomButton>

          <ActionButton
            type="button"
            variant="green"
            icon={Plus}
            onClick={handleAppendRole}
            className="block sm:hidden"
          />
        </div>

        {fields?.map((data, idx) => (
          <div key={data?.role || idx} className="pb-4 grid grid-cols-12 gap-6">
            {/* Role */}
            <LabelInput
              id={`positions-${idx}.role`}
              label="Role"
              colSpan="col-span-12 sm:col-span-6"
              required
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
                icon={Calendar}
                placeholder="Select Date"
                {...register(`positions.${idx}.startDate`, {
                  required: "Start Date is required!",
                })}
                error={errors?.positions?.[idx]?.startDate}
              />

              <FieldError error={errors.positions?.[idx]?.startDate?.message} />
            </LabelInput>

            {/* End Date */}
            <LabelInput
              id={`positions-${idx}.endDate`}
              icon={Calendar}
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
              id={`positions-${idx}.isCurrent`}
              label="Currently working on this position"
              colSpan="col-span-9 sm:col-span-4 lg:col-span-5"
              type="checkbox"
            >
              <input
                id={`positions-${idx}.isCurrent`}
                type="checkbox"
                {...register(`positions.${idx}.isCurrent`)}
                error={errors?.positions?.[idx]?.isCurrent}
              />
            </LabelInput>

            <ActionButton
              type="button"
              variant="red"
              icon={Trash2}
              onClick={() => remove(idx)}
              className="w-fit h-fit self-center col-span-3 sm:col-span-2 lg:col-span-1"
            />
          </div>
        ))}
      </div>

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
