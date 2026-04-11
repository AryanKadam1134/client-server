import React, { useRef, useState, useEffect } from "react";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Trash2, Loader, FileText } from "lucide-react";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomSelect from "../../components/ui/CustomSelect";
import CustomTextArea from "../../components/ui/CustomTextArea";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import CustomMultiSelect from "../../components/ui/CustomMultiSelect";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useSkillsList from "../../hooks/useSkillsList";
import useVisibilities from "../../hooks/useVisibilities";
import useOrganizationsList from "../../hooks/useOrganizationsList";
import useProjectCategoriesList from "../../hooks/useProjectCategoriesList";

function DragDropUpload({
  onChange,
  loading = false,
  text = "Drop files here",
  className = "",
  ...props // ✅ accept multiple, accept, etc.
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files?.length) return;

    onChange?.(files); // ✅ always pass FileList
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    onChange?.(files); // ✅ always pass FileList
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current.click()}
        className={`
          w-full min-h-32 flex flex-col items-center justify-center gap-3
          border-2 border-dashed border-gray-500 rounded-lg cursor-pointer
          transition-all duration-200 px-4 py-5 text-center
          ${isDragging && "border-blue-400 bg-blue-500/10"}
          ${!loading && "hover:bg-gray-200 hover:border-gray-600"}
          ${className}
        `}
      >
        {loading ? (
          <Loader size={24} className="text-blue-400 animate-spin" />
        ) : (
          <>
            <FileText size={24} className="text-gray-500" />

            <div className="text-gray-500 text-xs font-medium">
              {text}
              <br />
              OR
              <br />
              Click to browse
            </div>
          </>
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
        {...props} // ✅ multiple, accept, etc.
      />
    </>
  );
}

export default function AddEditProject() {
  const { skillsList } = useSkillsList();
  const { visibilities } = useVisibilities();
  const { organizationsList } = useOrganizationsList();
  const { projectCategoriesList } = useProjectCategoriesList();

  const { projectId } = useParams();

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
    },
  });

  const projectImages = useWatch({ control, name: "projectImages" });

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
      const res = await apiEndpoints.getProject(projectId);

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

  // Can uplaod multiple
  const updateProjectImage = async (files) => {
    setImagesUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("projectImages", file);
      });

      await apiEndpoints.updateProjectImage(projectId, formData);

      fetchProject();
      console.log("Images uploaded successfully!");
    } catch (error) {
      console.error("Error updating Project Images: ", error);
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteProjectImage = async (imagePublicId) => {
    try {
      await apiEndpoints.deleteProjectImage(projectId, imagePublicId);

      fetchProject();
      console.log("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting Project Image: ", error);
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

      {/* Organization */}
      <LabelInput
        id="organizationId"
        label="Organization"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <Controller
          name="organizationId"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="organizationId"
              placeholder="Select Organization"
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

      {/* Description */}
      <LabelInput
        id="description"
        label="Description"
        colSpan="col-span-12 sm:col-span-6"
        required
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
        required
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
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="category"
              placeholder="Select Project Category"
              options={projectCategoriesList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Start Date */}
      <LabelInput
        id="startDate"
        label="Start Date"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomDatePicker
          id="startDate"
          placeholder={`Enter Start Date`}
          {...register("startDate")}
          error={errors?.startDate}
        />
      </LabelInput>

      {/* End Date */}
      <LabelInput
        id="endDate"
        label="End Date"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomDatePicker
          id="endDate"
          placeholder={`Enter End Date`}
          {...register("endDate")}
          error={errors?.endDate}
        />
      </LabelInput>

      {/* Present */}
      <LabelInput
        id="present"
        label="Present"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        type="checkbox"
        required
      >
        <input
          id="present"
          type="checkbox"
          placeholder={`Enter Present`}
          {...register("present")}
          error={errors?.present}
        />
      </LabelInput>

      {/* Featured */}
      <LabelInput
        id="featured"
        label="Featured"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        type="checkbox"
        required
      >
        <input
          id="featured"
          type="checkbox"
          placeholder={`Enter Featured`}
          {...register("featured")}
          error={errors?.featured}
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

      <div className="col-span-6"></div>

      {/* Upload Image  */}
      <LabelInput
        id="visibility"
        label="Upload Image"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <DragDropUpload
          multiple
          accept="image/*"
          loading={imagesUploading}
          onChange={(files) => updateProjectImage(files)}
        />
      </LabelInput>

      <div className="col-span-12 sm:col-span-9 flex items-center justify-start gap-3">
        {projectImages?.map((image, idx) => (
          <div
            key={image?.public_id || idx}
            className="relative h-[100px] w-[200px]"
          >
            <img src={image?.url} alt="" />

            <button
              type="button"
              onClick={() => deleteProjectImage(image?.public_id)}
              className="absolute top-2 right-2 p-1 text-white bg-red-500 hover:bg-red-600 rounded transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
