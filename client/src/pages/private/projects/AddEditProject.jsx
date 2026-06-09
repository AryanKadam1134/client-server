import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  Trash2,
  Loader,
  ChevronLeft,
  ChevronRight,
  Image,
  ExternalLink,
  Link,
  Calendar,
} from "lucide-react";

import ImageGallery from "../../../components/common/ImageGallery";
import CommonSkeleton from "../../../components/common/CommonSkeleton";

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

import { formatDate } from "../../../utils/formatDate";

import { apiEndpoints } from "../../../api";

import useSkillsList from "../../../hooks/useSkillsList";
import useVisibilities from "../../../hooks/useVisibilities";
import useOrganizationsList from "../../../hooks/useOrganizationsList";
import useProjectCategoriesList from "../../../hooks/useProjectCategoriesList";

import { useNotify } from "../../../context/NotificationContext";

export default function AddEditProject() {
  const { notify } = useNotify();

  const { skillsList } = useSkillsList();
  const { visibilities } = useVisibilities();
  const { organizationsList } = useOrganizationsList();
  const { projectCategoriesList } = useProjectCategoriesList();

  const { projectId } = useParams();

  const [id, setId] = useState(projectId);

  const [loading, setLoading] = useState(true);

  const [imagesUploading, setImagesUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      featured: true,
      visibility: "public",
    },
    mode: "onChange",
  });

  const projectImages = useWatch({ control, name: "projectImages" });
  const coverImageIndex = useWatch({ control, name: "coverImageIndex" });
  const githubLink = useWatch({ control, name: "githubLink" });
  const liveLink = useWatch({ control, name: "liveLink" });
  const startDate = watch("startDate");
  const endDate = watch("endDate");

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
      const res = await apiEndpoints.getProject(id);

      const data = res.data;

      reset({
        ...data,
        startDate: formatDate(data?.startDate),
        endDate: formatDate(data?.endDate),
      });
      console.log("Project: ", data);
    } catch (error) {
      console.error("Error fetching Project: ", error);
      notify.msgError(error?.message || "Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const addUpdateProject = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await apiEndpoints.updateProject(id, updatedData);
        notify.msgSuccess("Project Updated!");
      } else {
        res = await apiEndpoints.addProject(payload);
        notify.msgSuccess("Project Saved!");
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Project Saved: ", data);
    } catch (error) {
      console.error("Error saving Project: ", error);
      notify.msgError(error?.message || "Failed to save project");
    }
  };

  const handleCoverChange = async (idx) => {
    setValue("coverImageIndex", idx, { shouldDirty: true });

    try {
      await apiEndpoints.updateProject(id, {
        coverImageIndex: idx,
      });

      notify.msgSuccess("Cover Image Changed!");
    } catch (err) {
      console.error(err);
      notify.msgError(err?.message || "Failed to change cover image");
    }
  };

  // Can uplaod multiple
  const updateProjectImage = async (files) => {
    setImagesUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("projectImages", file);
      });

      await apiEndpoints.updateProjectImage(id, formData);

      fetchProject();
      notify.msgSuccess("Project Images Updated!");
      // console.log("Images uploaded successfully!");
    } catch (error) {
      console.error("Error updating Project Images: ", error);
      notify.msgError(error?.message || "Failed to upload project images");
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteProjectImage = async (imagePublicId) => {
    setImageDeleting(imagePublicId);

    try {
      await apiEndpoints.deleteProjectImage(id, imagePublicId);

      fetchProject();
      notify.msgSuccess("Project Image Deleted!");
      // console.log("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting Project Image: ", error);
      notify.msgError(error?.message || "Failed to delete project image");
    } finally {
      setImageDeleting(null);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProject();
  }, [id]);

  if (id && loading) {
    return <CommonSkeleton count={13} />;
  }

  return (
    <form
      onSubmit={handleSubmit(addUpdateProject)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {id && (
        <>
          {/* Upload Project Images */}
          <LabelInput
            id="upload"
            label="Upload Project Images"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <DragDropUpload
              id="upload"
              multiple
              accept="image/*"
              loading={imagesUploading}
              onChange={(files) => updateProjectImage(files)}
            />
          </LabelInput>

          <ImageGallery
            className="col-span-12 sm:col-span-9"
            images={projectImages}
            coverImageIndex={coverImageIndex}
            imageDeletingId={imageDeleting}
            handleCoverChange={handleCoverChange}
            deleteImage={deleteProjectImage}
          />

          <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
        </>
      )}

      {/* Project Name */}
      <LabelInput
        id="title"
        label="Project Name"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="title"
          type="text"
          placeholder="Enter project name"
          {...register("title", {
            required: "Project name is required!",
            minLength: {
              value: 2,
              message: "Project name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Project name must not exceed 100 characters",
            },
          })}
          error={errors?.title}
        />

        <FieldError error={errors.title?.message} />
      </LabelInput>

      {/* Organization */}
      <LabelInput
        id="organizationId"
        label="Organization (Link Company you worked in)"
        colSpan="col-span-12 sm:col-span-6"
      >
        <Controller
          name="organizationId"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="organizationId"
              placeholder="Select Company you worked in"
              options={organizationsList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Live Link */}
      <LabelInput
        id="liveLink"
        label="Live Link"
        colSpan="col-span-12 sm:col-span-6"
        attachment={
          liveLink && (
            <a
              href={liveLink}
              target="_blank"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              <ExternalLink size={13} /> <p>Visit Link</p>
            </a>
          )
        }
      >
        <CustomInput
          id="liveLink"
          type="text"
          icon={Link}
          placeholder="https://example.com"
          {...register("liveLink", {
            pattern: {
              value: /^(https:\/\/.+)?$/,
              message: "URL must start with https://",
            },
          })}
          error={errors?.liveLink}
        />
      </LabelInput>

      {/* Github Link */}
      <LabelInput
        id="githubLink"
        label="GitHub Link"
        colSpan="col-span-12 sm:col-span-6"
        attachment={
          githubLink && (
            <a
              href={githubLink}
              target="_blank"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              <ExternalLink size={13} /> <p>Visit Link</p>
            </a>
          )
        }
      >
        <CustomInput
          id="githubLink"
          type="text"
          icon={Link}
          placeholder="https://github.com/username/repo"
          {...register("githubLink", {
            pattern: {
              value: /^(https:\/\/.+)?$/,
              message: "URL must start with https://",
            },
          })}
          error={errors?.githubLink}
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
          placeholder="Describe your project, its goals, and key features..."
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
              placeholder="Select Tech Stack"
              options={skillsList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Project Category */}
      <LabelInput
        id="category"
        label="Project Category"
        colSpan="col-span-12 sm:col-span-6"
      >
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="category"
              placeholder="e.g. Personal, Freelance, Hackathon"
              options={projectCategoriesList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Featured */}
      <LabelInput
        id="featured"
        label="Featured"
        colSpan="col-span-12 sm:col-span-6"
        type="checkbox"
        attachment={
          <p className="font-normal text-xs opacity-80">
            Helps in filtering the projects
          </p>
        }
      >
        <input
          id="featured"
          type="checkbox"
          {...register("featured")}
          error={errors?.featured}
        />
      </LabelInput>

      {/* Start Date */}
      <LabelInput
        id="startDate"
        label="Start Date"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomDatePicker
          id="startDate"
          icon={Calendar}
          placeholder="YYYY-MM-DD"
          {...register("startDate", {
            required: "Start date is required!",
            validate: (value) => {
              if (endDate && value && dayjs(value).isAfter(dayjs(endDate))) {
                return "Start date cannot be after end date";
              }
              return true;
            },
          })}
          error={errors?.startDate}
        />

        <FieldError error={errors.startDate?.message} />
      </LabelInput>

      {/* End Date */}
      <LabelInput
        id="endDate"
        label="End Date"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomDatePicker
          id="endDate"
          icon={Calendar}
          placeholder="YYYY-MM-DD (leave blank if current)"
          {...register("endDate", {
            validate: (value) => {
              if (
                value &&
                startDate &&
                dayjs(value).isBefore(dayjs(startDate))
              ) {
                return "End date cannot be before start date";
              }
              return true;
            },
          })}
          error={errors?.endDate}
        />

        <FieldError error={errors.endDate?.message} />
      </LabelInput>

      {/* Present */}
      <LabelInput
        id="isCurrent"
        label="Currently working"
        colSpan="col-span-12 sm:col-span-6"
        type="checkbox"
      >
        <input
          id="isCurrent"
          type="checkbox"
          {...register("isCurrent")}
          error={errors?.isCurrent}
        />
      </LabelInput>

      {/* Sort Order */}
      <LabelInput
        id="sortOrder"
        label="Display Order"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="sortOrder"
          type="number"
          min={0}
          placeholder="0 (appears first)"
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

      <div className="hidden sm:block col-span-6" />

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
