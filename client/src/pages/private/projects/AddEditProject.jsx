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
} from "lucide-react";

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

  const [imagesUploading, setImagesUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
    setValue,
  } = useForm({
    defaultValues: {
      sortOrder: 0,
      featured: true,
      visibility: "public",
    },
    mode: "onChange",
  });

  const projectImages = useWatch({ control, name: "projectImages" });
  const coverImageIndex = useWatch({ control, name: "coverImageIndex" });
  const githubLink = useWatch({ control, name: "githubLink" });
  const liveLink = useWatch({ control, name: "liveLink" });

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
      if (data?._id) fetchProject();
      console.log("Project Saved: ", data);
    } catch (error) {
      console.error("Error saving Project: ", error);
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
    } finally {
      setImageDeleting(null);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProject();
  }, [id]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateProject)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
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
          placeholder="Project Name"
          {...register("title", {
            required: "Project Name is required!",
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
          placeholder="Live URL"
          {...register("liveLink", {
            pattern: {
              value: /^https:\/\/.+$/,
              message: "URL must start with https://",
            },
          })}
          error={errors?.liveLink}
        />
      </LabelInput>

      {/* Github Link */}
      <LabelInput
        id="githubLink"
        label="Github Link"
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
          placeholder="Repository Link"
          {...register("githubLink", {
            pattern: {
              value: /^https:\/\/.+$/,
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
          placeholder="Select Date"
          {...register("startDate", {
            required: "Start Date is required!",
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
          placeholder="Select Date"
          {...register("endDate")}
          error={errors?.endDate}
        />
      </LabelInput>

      {/* Present */}
      <LabelInput
        id="isCurrent"
        label="Currently working on this project"
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

      <div className="hidden sm:block col-span-6" />

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

          {/* Project Cover Image */}
          <LabelInput
            label="Project Cover Image"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <div className="h-[120px] rounded overflow-hidden border border-gray-400">
              <img
                src={
                  projectImages?.find((_, idx) => idx == coverImageIndex)?.url
                }
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </LabelInput>

          <div className="col-span-12 sm:col-span-6 relative">
            {/* Scroll Buttons */}
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("image-scroll")
                  ?.scrollBy({ left: -300, behavior: "smooth" })
              }
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full cursor-pointer"
            >
              <ChevronLeft />
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("image-scroll")
                  ?.scrollBy({ left: 300, behavior: "smooth" })
              }
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full cursor-pointer"
            >
              <ChevronRight />
            </button>

            {/* Image Container */}
            <div
              id="image-scroll"
              className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] lg:auto-cols-[30%] gap-4 overflow-x-auto scroll-smooth pb-2"
            >
              {projectImages?.map((image, idx) => (
                <div
                  key={image?.public_id || idx}
                  className="relative group h-[120px] rounded overflow-hidden border border-gray-400"
                >
                  {/* Image */}
                  <img
                    src={image?.url}
                    alt=""
                    className="w-full h-full object-contain"
                  />

                  {/* Loader */}
                  {imageDeleting === image?.public_id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <Loader size={24} className="animate-spin text-white" />
                    </div>
                  )}

                  {idx !== coverImageIndex && (
                    <button
                      type="button"
                      onClick={() => handleCoverChange(idx)}
                      className="absolute top-2 left-2 p-1 rounded bg-green-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-green-600 cursor-pointer"
                    >
                      <Image size={18} />
                    </button>
                  )}

                  {/* Delete Button (Hover Only) */}
                  <button
                    type="button"
                    onClick={() => deleteProjectImage(image?.public_id)}
                    className="absolute top-2 right-2 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
