import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { Trash2, Loader } from "lucide-react";

import FieldError from "../../../components/ui/FieldError";
import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import DragDropUpload from "../../../components/ui/DragDropUpload";
import CustomTextArea from "../../../components/ui/CustomTextArea";

import { apiEndpoints } from "../../../api";

import { useNotify } from "../../../context/NotificationContext";

export default function AddEditEducation() {
  const { notify } = useNotify();

  const { educationId } = useParams();

  const [id, setId] = useState(educationId);

  const [imagesUploading, setImagesUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
    watch,
  } = useForm({ mode: "onChange" });

  const instituteImage = useWatch({ control, name: "instituteImage" });
  const startYear = watch("startYear");

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

  const fetchEducation = async () => {
    try {
      const res = await apiEndpoints.getEducation(id);

      const data = res.data;

      reset(data);
      console.log("Education: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch education");
    }
  };

  const addUpdateEducation = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);

        res = await apiEndpoints.updateEducation(id, updatedData);
        notify.msgSuccess("Education Updated!");
      } else {
        res = await apiEndpoints.addEducation(payload);
        notify.msgSuccess("Education Saved!");
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Education Saved: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to save education");
    }
  };

  // Can uplaod multiple
  const updateInstituteImage = async (files) => {
    const file = files[0];

    setImagesUploading(true);

    try {
      const formData = new FormData();

      formData.append("instituteImage", file);

      await apiEndpoints.updateInstituteImage(id, formData);

      fetchEducation();
      notify.msgSuccess("Institute Image Updated!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to update institute image");
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteInstituteImage = async () => {
    setImageDeleting(true);
    try {
      await apiEndpoints.deleteInstituteImage(id);

      fetchEducation();
      notify.msgSuccess("Institute Image Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete institute image");
    } finally {
      setImageDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchEducation();
  }, [id]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateEducation)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Institute Name */}
      <LabelInput
        id="instituteName"
        label="Institute Name"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="instituteName"
          type="text"
          placeholder="Enter institute name"
          {...register("instituteName", {
            required: "Institute name is required!",
            minLength: {
              value: 2,
              message: "Institute name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Institute name must not exceed 100 characters",
            },
          })}
          error={errors?.instituteName}
        />

        <FieldError error={errors.instituteName?.message} />
      </LabelInput>

      {/* Qualification */}
      <LabelInput
        id="qualification"
        label="Degree / Field of Study"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="qualification"
          type="text"
          placeholder="e.g., Bachelor of Science in Computer Science"
          {...register("qualification", {
            required: "Degree is required!",
            minLength: {
              value: 2,
              message: "Degree must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Degree must not exceed 100 characters",
            },
          })}
          error={errors?.qualification}
        />

        <FieldError error={errors.qualification?.message} />
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
          placeholder="Describe your education, coursework, achievements..."
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

      {/* Start Year */}
      <LabelInput
        id="startYear"
        label="Start Year"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="startYear"
          type="number"
          placeholder="e.g., 2018"
          {...register("startYear", {
            required: "Start year is required!",
            min: {
              value: 1900,
              message: "Start year must be 1900 or later",
            },
            max: {
              value: new Date().getFullYear(),
              message: `Start year cannot be in the future`,
            },
          })}
          error={errors?.startYear}
        />

        <FieldError error={errors.startYear?.message} />
      </LabelInput>

      {/* End Year */}
      <LabelInput
        id="endYear"
        label="End Year"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="endYear"
          type="number"
          placeholder="e.g., 2022 (leave blank if current)"
          {...register("endYear", {
            min: {
              value: 1900,
              message: "End year must be 1900 or later",
            },
            max: {
              value: new Date().getFullYear() + 10,
              message: "End year cannot be more than 10 years in the future",
            },
            validate: (value) => {
              if (value && startYear && Number(value) < Number(startYear)) {
                return "End year cannot be before start year";
              }
              return true;
            },
          })}
          error={errors?.endYear}
        />

        <FieldError error={errors.endYear?.message} />
      </LabelInput>

      {/* Present */}
      <LabelInput
        id="isCurrent"
        label="Currently studying here"
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

      {/* Percentage */}
      <LabelInput
        id="percentage"
        label="Percentage / Grade"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="percentage"
          type="number"
          step="0.01"
          min={0}
          max={100}
          placeholder="e.g., 85.5"
          {...register("percentage", {
            min: {
              value: 0,
              message: "Percentage cannot be less than 0",
            },
            max: {
              value: 100,
              message: "Percentage cannot be more than 100",
            },
          })}
          error={errors?.percentage}
        />

        <FieldError error={errors.percentage?.message} />
      </LabelInput>

      {/* CGPA */}
      <LabelInput id="cgpa" label="CGPA" colSpan="col-span-12 sm:col-span-6">
        <CustomInput
          id="cgpa"
          type="number"
          step="0.01"
          min={0}
          max={10}
          placeholder="e.g., 8.5"
          {...register("cgpa", {
            min: {
              value: 0,
              message: "CGPA cannot be less than 0",
            },
            max: {
              value: 10,
              message: "CGPA cannot be more than 10",
            },
          })}
          error={errors?.cgpa}
        />

        <FieldError error={errors.cgpa?.message} />
      </LabelInput>

      {id && (
        <>
          {/* Upload Institute Image  */}
          <LabelInput
            id="upload"
            label="Upload Institute Image"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <DragDropUpload
              id="upload"
              accept="image/*"
              loading={imagesUploading}
              onChange={(files) => updateInstituteImage(files)}
            />
          </LabelInput>

          {/* Institute Image */}
          <LabelInput
            label="Institute Image"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <div className="relative group h-[120px] rounded overflow-hidden border border-light-border-primary dark:border-dark-border-primary">
              {/* Loader */}
              {imageDeleting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <Loader size={24} className="animate-spin text-white" />
                </div>
              )}

              <img
                src={instituteImage?.url}
                alt=""
                className="w-full h-full object-contain"
              />

              {/* Delete Button (Hover Only) */}
              {instituteImage?.url && (
                <button
                  type="button"
                  onClick={deleteInstituteImage}
                  className="absolute top-2 right-2 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              )}
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
