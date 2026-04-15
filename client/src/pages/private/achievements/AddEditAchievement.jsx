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

export default function AddEditAchievement() {
  const { visibilities } = useVisibilities();
  const { projectCategoriesList } = useProjectCategoriesList();

  const { achievementId } = useParams();

  const [id, setId] = useState(achievementId);

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
  });

  const achievementImages = useWatch({ control, name: "achievementImages" });
  const coverImageIndex = useWatch({ control, name: "coverImageIndex" });
  const link = useWatch({ control, name: "link" });

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

  const fetchAchievement = async () => {
    try {
      const res = await apiEndpoints.getAchievement(id);

      const data = res.data;

      reset({
        ...data,
        date: formatDate(data?.date),
      });
      console.log("Achievement: ", data);
    } catch (error) {
      console.error("Error fetching Achievement: ", error);
    }
  };

  const addUpdateAchievement = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await apiEndpoints.updateAchievemnet(id, updatedData);
      } else {
        res = await apiEndpoints.addAchievemnet(payload);
      }

      const data = res.data;

      setId(data?._id);
      if (data?._id) fetchAchievement();
      console.log("Achievement Saved: ", data);
    } catch (error) {
      console.error("Error saving Achievement: ", error);
    }
  };

  const handleCoverChange = async (idx) => {
    setValue("coverImageIndex", idx, { shouldDirty: true });

    try {
      await apiEndpoints.updateAchievement(id, {
        coverImageIndex: idx,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Can uplaod multiple
  const updateAchievementImage = async (files) => {
    setImagesUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("achievementImages", file);
      });

      await apiEndpoints.updateAchievementImage(id, formData);

      fetchAchievement();
      console.log("Images uploaded successfully!");
    } catch (error) {
      console.error("Error updating Achievement Images: ", error);
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteAchievementImage = async (imagePublicId) => {
    setImageDeleting(imagePublicId);

    try {
      await apiEndpoints.deleteAchievementImage(id, imagePublicId);

      fetchAchievement();
      console.log("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting Achievement Image: ", error);
    } finally {
      setImageDeleting(null);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchAchievement();
  }, [id]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateAchievement)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Achievement Name */}
      <LabelInput
        id="title"
        label="Achievement Name"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="title"
          type="text"
          placeholder={`Enter Achievement Name`}
          {...register("title", {
            required: "Achievement Name is required!",
          })}
          error={errors?.title}
        />
      </LabelInput>

      {/* Issuer */}
      <LabelInput
        id="issuer"
        label="Issuer"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="issuer"
          type="text"
          placeholder={`Enter Issuer`}
          {...register("issuer", {
            required: "Issuer is required!",
          })}
          error={errors?.issuer}
        />
      </LabelInput>

      {/* Attached Certificate */}
      <LabelInput
        id="certificateId"
        label="Attached Certificate"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <Controller
          name="certificateId"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="certificateId"
              placeholder="Select Attached Certificate"
              options={projectCategoriesList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Reffered Link */}
      <LabelInput
        id="link"
        label="Reffered Link"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        attachment={
          link && (
            <a
              href={link}
              target="_blank"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              <ExternalLink size={13} /> <p>Visit Link</p>
            </a>
          )
        }
      >
        <CustomInput
          id="link"
          type="text"
          placeholder={`Link`}
          {...register("link")}
          error={errors?.link}
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

      {/* Date */}
      <LabelInput
        id="date"
        label="Date"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomDatePicker
          id="date"
          placeholder={`Enter Date`}
          {...register("date", {
            required: "Date is required!",
          })}
          error={errors?.date}
        />
      </LabelInput>

      {/* Featured */}
      <LabelInput
        id="featured"
        label="Featured"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        type="checkbox"
      >
        <input
          id="featured"
          type="checkbox"
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
          placeholder={`Enter Achievement Sort Order`}
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

      <div className="hidden sm:block col-span-6"></div>

      {/* Upload Image  */}
      <LabelInput
        id="upload"
        label="Upload Image"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <DragDropUpload
          id="upload"
          multiple
          accept="image/*"
          loading={imagesUploading}
          onChange={(files) => updateAchievementImage(files)}
        />
      </LabelInput>

      {/* Cover Image */}
      <LabelInput
        label="Cover Image"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <div className="h-[120px] rounded overflow-hidden border border-gray-400">
          <img
            src={
              achievementImages?.find((_, idx) => idx == coverImageIndex)?.url
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
          {achievementImages?.map((image, idx) => (
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
                onClick={() => deleteAchievementImage(image?.public_id)}
                className="absolute top-2 right-2 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
