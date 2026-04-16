import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Trash2, Loader, ExternalLink } from "lucide-react";

import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import DragDropUpload from "../../../components/ui/DragDropUpload";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";
import CustomMultiSelect from "../../../components/ui/CustomMultiSelect";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../../api";

import useSkillsList from "../../../hooks/useSkillsList";
import useVisibilities from "../../../hooks/useVisibilities";

export default function AddEditCertificate() {
  const { skillsList } = useSkillsList();
  const { visibilities } = useVisibilities();

  const { certificateId } = useParams();

  const [id, setId] = useState(certificateId);

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
    },
  });

  const credentialUrl = useWatch({ control, name: "credentialUrl" });
  const certificateImage = useWatch({ control, name: "certificateImage" });

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

  const fetchCertificate = async () => {
    try {
      const res = await apiEndpoints.getCertificate(id);

      const data = res.data;

      reset({
        ...data,
        issueDate: formatDate(data?.issueDate),
        expiryDate: formatDate(data?.expiryDate),
      });
      console.log("Certificate: ", data);
    } catch (error) {
      console.error("Error fetching Certificate: ", error);
    }
  };

  const addUpdateCertificate = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);

        res = await apiEndpoints.updateCertificate(id, updatedData);
      } else {
        res = await apiEndpoints.addCertificate(payload);
      }

      const data = res.data;

      setId(data?._id);
      if (data?._id) fetchCertificate();
      console.log("Certificate Saved: ", data);
    } catch (error) {
      console.error("Error saving Certificate: ", error);
    }
  };

  // Can uplaod multiple
  const updateCertificateImage = async (files) => {
    const file = files[0];

    setImagesUploading(true);

    try {
      const formData = new FormData();

      formData.append("certificateImage", file);

      await apiEndpoints.updateCertificateImage(id, formData);

      fetchCertificate();
      console.log("Images uploaded successfully!");
    } catch (error) {
      console.error("Error updating Certificate Images: ", error);
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteCertificateImage = async () => {
    setImageDeleting(true);
    try {
      await apiEndpoints.deleteCertificateImage(id);

      fetchCertificate();
      console.log("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting Certificate Image: ", error);
    } finally {
      setImageDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCertificate();
  }, [id]);

  return (
    <form
      onSubmit={handleSubmit(addUpdateCertificate)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Certificate Name */}
      <LabelInput
        id="title"
        label="Certificate Name"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="title"
          type="text"
          placeholder="Certificate Name"
          {...register("title", {
            required: "Certificate Name is required!",
          })}
          error={errors?.title}
        />
      </LabelInput>

      {/* Issued By */}
      <LabelInput
        id="issuer"
        label="Issued By"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInput
          id="issuer"
          type="text"
          placeholder="Certificate Issuer's Name"
          {...register("issuer", {
            required: "Issuer is required!",
          })}
          error={errors?.issuer}
        />
      </LabelInput>

      {/* Credential Id */}
      <LabelInput
        id="credentialId"
        label="Credential Id"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomInput
          id="credentialId"
          type="text"
          placeholder="Credential Id (if any)"
          {...register("credentialId")}
          error={errors?.credentialId}
        />
      </LabelInput>

      {/* Credential URL */}
      <LabelInput
        id="credentialUrl"
        label="Credential URL"
        colSpan="col-span-12 sm:col-span-6"
        attachment={
          credentialUrl && (
            <a
              href={credentialUrl}
              target="_blank"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              <ExternalLink size={13} /> <p>Visit Link</p>
            </a>
          )
        }
      >
        <CustomInput
          id="credentialUrl"
          type="text"
          placeholder="Drive Link or Other"
          {...register("credentialUrl")}
          error={errors?.credentialUrl}
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
          placeholder="About this certificate"
          {...register("description")}
          error={errors?.description}
        />
      </LabelInput>

      {/* Skills */}
      <LabelInput
        id="skills"
        label="Skills"
        colSpan="col-span-12 sm:col-span-6"
      >
        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <CustomMultiSelect
              id="skills"
              placeholder="Select Skills"
              options={skillsList}
              value={field.value}
              onChange={field.onChange} // send value to hook form
            />
          )}
        />
      </LabelInput>

      {/* Issue Date */}
      <LabelInput
        id="issueDate"
        label="Issue Date"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomDatePicker
          id="issueDate"
          placeholder="Select Date"
          {...register("issueDate", {
            required: "Issue Date is required!",
          })}
          error={errors?.issueDate}
        />
      </LabelInput>

      {/* Expiry Date */}
      <LabelInput
        id="expiryDate"
        label="Expiry Date"
        colSpan="col-span-12 sm:col-span-6"
      >
        <CustomDatePicker
          id="expiryDate"
          placeholder="Select Date"
          {...register("expiryDate")}
          error={errors?.expiryDate}
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
          onChange={(files) => updateCertificateImage(files)}
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
            src={certificateImage?.url}
            alt=""
            className="w-full h-full object-contain"
          />

          {/* Delete Button (Hover Only) */}
          {certificateImage?.url && (
            <button
              type="button"
              onClick={deleteCertificateImage}
              className="absolute top-2 right-2 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </LabelInput>

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
