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

export default function AddEditEducation() {
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
  } = useForm({ mode: "onChange" });

  const instituteImage = useWatch({ control, name: "instituteImage" });

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
      console.error("Error fetching Education: ", error);
    }
  };

  const addUpdateEducation = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);

        res = await apiEndpoints.updateEducation(id, updatedData);
      } else {
        res = await apiEndpoints.addEducation(payload);
      }

      const data = res.data;

      setId(data?._id);
      if (data?._id) fetchEducation();
      console.log("Education Saved: ", data);
    } catch (error) {
      console.error("Error saving Education: ", error);
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
      console.log("Images uploaded successfully!");
    } catch (error) {
      console.error("Error updating Education Images: ", error);
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteInstituteImage = async () => {
    setImageDeleting(true);
    try {
      await apiEndpoints.deleteInstituteImage(id);

      fetchEducation();
      console.log("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting Institute Image: ", error);
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
          placeholder="School / College Name"
          {...register("instituteName", {
            required: "Institute Name is required!",
          })}
          error={errors?.instituteName}
        />

        <FieldError error={errors.instituteName?.message} />
      </LabelInput>

      {/* Qualification */}
      <LabelInput
        id="qualification"
        label="Qualification"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="qualification"
          type="text"
          placeholder="Degree / Field"
          {...register("qualification", {
            required: "Qualification is required!",
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

      {/* Address */}
      <LabelInput
        id="address"
        label="Address"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomTextArea
          id="address"
          type="text"
          placeholder="Enter Address"
          {...register("address")}
          error={errors?.address}
        />
      </LabelInput>

      {/* Start Year */}
      <LabelInput
        id="startYear"
        label="Start Year"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="startYear"
          type="number"
          placeholder="e.g. 2021"
          {...register("startYear", {
            required: "Start Year is required!",
          })}
          error={errors?.startYear}
        />
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
          placeholder="e.g. 2025"
          {...register("endYear")}
          error={errors?.endYear}
        />
      </LabelInput>

      {/* Present */}
      <LabelInput
        id="present"
        label="Present"
        colSpan="col-span-12 sm:col-span-6"
        type="checkbox"
      >
        <input
          id="present"
          type="checkbox"
          {...register("present")}
          error={errors?.present}
        />
      </LabelInput>

      {/* Percentage */}
      <LabelInput
        id="percentage"
        label="Percentage"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="percentage"
          type="number"
          min={0}
          max={100}
          placeholder="e.g. 81"
          {...register("percentage", {
            min: 0,
            max: 100,
          })}
          error={errors?.percentage}
        />
      </LabelInput>

      {/* CGPA */}
      <LabelInput id="cgpa" label="CGPA" colSpan="col-span-12 sm:col-span-6">
        <CustomInput
          id="cgpa"
          type="number"
          step="any"
          min={0}
          max={10}
          placeholder="e.g. 8.1"
          {...register("cgpa", {
            min: 0,
            max: 10,
          })}
          error={errors?.cgpa}
        />
      </LabelInput>

      {id && (
        <>
          {" "}
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
            <div className="relative group h-[120px] rounded overflow-hidden border border-gray-400">
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
