import React, { useState, useRef, useEffect } from "react";

import { useForm } from "react-hook-form";
import {
  Loader,
  SquarePen,
  FileText,
  Trash2,
  FilePenLine,
  Edit,
} from "lucide-react";

import FieldError from "../../components/ui/FieldError";
import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomTextArea from "../../components/ui/CustomTextArea";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useGenders from "../../hooks/useGenders";

import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../context/NotificationContext";

function ResumeDropZone({
  fileInputRef,
  preview,
  resumeOrCv,
  resumeLoading,
  uploadFile,
  updateResume,
  deleteResume,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || file.type !== "application/pdf") return;

    // Simulate the same flow as file input
    const fakeEvent = { target: { files: [file] } };
    uploadFile(fakeEvent, "resumeOrCv", updateResume);
  };

  const hasFile = preview?.resumeOrCv || resumeOrCv?.url;
  const fileName = resumeOrCv?.name || "resume.pdf";

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !resumeLoading && fileInputRef.current.click()}
        className={`
          flex-1 min-h-32 flex flex-col items-center justify-center gap-3
          border-2 border-dashed border-light-border-secondary dark:border-dark-border-secondary hover:border-light-border-primary dark:hover:border-dark-border-primary rounded-lg cursor-pointer
          transition-all duration-200 px-4 py-5 text-center
          ${isDragging && "border-blue-400 dark:border-blue-500 bg-blue-500/10 dark:bg-blue-950/20"}
          ${!resumeLoading && "hover:bg-light-bg-secondary dark:hover:bg-dark-bg-hover"}
        `}
      >
        {resumeLoading ? (
          <>
            <Loader size={24} className="text-blue-500 dark:text-blue-400 animate-spin" />
          </>
        ) : hasFile ? (
          <>
            <div className="flex flex-col items-center gap-1">
              <img src="/images/pdf.svg" alt="pdf svg" className="size-8" />
              <p className="text-xs font-medium truncate text-light-text-primary dark:text-dark-text-primary w-full">{fileName}</p>
            </div>

            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">Click to replace</p>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-1">
              <FileText size={24} className="text-light-text-tertiary dark:text-dark-text-tertiary" />
              <div className="text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium">
                Drop your PDF here
                <br />
                OR
                <br />
                Click to browse
              </div>
            </div>

            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">PDF only</p>
          </>
        )}
      </div>

      {/* Preview & Delete Button */}
      {hasFile && !resumeLoading && (
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteResume();
            }}
            className="flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-500 transition-colors py-1 cursor-pointer"
          >
            <Trash2 size={13} />
            Delete PDF
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(preview?.resumeOrCv || resumeOrCv?.url);
            }}
            className="flex items-center justify-center gap-1.5 text-xs text-blue-400 hover:text-blue-500 transition-colors py-1 cursor-pointer"
          >
            <FileText size={13} />
            Preview PDF
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        id="resumeOrCv"
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => uploadFile(e, "resumeOrCv", updateResume)}
      />
    </>
  );
}

export default function Dashboard() {
  const { setUser } = useAuth();
  const { notify } = useNotify();

  const { genders } = useGenders();

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [imageLoading, setImageLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [preview, setPreview] = useState({
    image: null,
    resumeOrCv: null,
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    mode: "onChange", // 🔥 important
  });

  const profileImage = getValues("image");
  const resumeOrCv = getValues("resumeOrCv");

  const fetchUserDetails = async () => {
    try {
      const res = await apiEndpoints.getCurrentUser();

      const data = res.data;

      reset(data);
      setUser(data);
      // console.log("User Details: ", data);
    } catch (error) {
      console.error("Error fetching User Details: ", error);
    }
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

  const onSubmit = async (data) => {
    const updatedData = getUpdatedFields(data, dirtyFields);

    console.log("Only Updated Fields:", updatedData);

    try {
      await apiEndpoints.updateUser(updatedData);

      fetchUserDetails();
      notify.msgSuccess("Details Updated!");
    } catch (error) {
      console.error("Error updating User Details: ", error);
    }
  };

  const uploadFile = (e, field, func) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Preview (instant UI feedback)
    const imageUrl = URL.createObjectURL(file);
    setPreview((prev) => ({ ...prev, [field]: imageUrl }));

    func(file);
    e.target.value = "";
  };

  const updateProfileImage = async (file) => {
    setImageLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      await apiEndpoints.updateUserImage(formData);

      fetchUserDetails();
      notify.msgSuccess("Profile Image Updated!");
    } catch (error) {
      console.error("Error updating image:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const deleteProfileImage = async () => {
    setImageLoading(true);

    try {
      await apiEndpoints.deleteUserImage();

      setPreview({});
      fetchUserDetails();
      notify.msgSuccess("Profile Image Deleted!");
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const updateResume = async (file) => {
    setResumeLoading(true);
    try {
      const formData = new FormData();
      formData.append("resumeOrCv", file);

      await apiEndpoints.updateUserResume(formData);

      fetchUserDetails();
      notify.msgSuccess("Resume Updated!");
    } catch (error) {
      console.error("Error updating resume:", error);
    } finally {
      setResumeLoading(false);
    }
  };

  const deleteResume = async () => {
    setResumeLoading(true);

    try {
      await apiEndpoints.deleteUserResume();

      setPreview({});
      fetchUserDetails();
      notify.msgSuccess("Resume Updated!");
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setResumeLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    return () => {
      if (preview.image) URL.revokeObjectURL(preview.image);
    };
  }, [preview.image]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* User Image */}
      <div className="row-span-3 col-span-12 sm:col-span-6 lg:col-span-3 flex items-center justify-center">
        <div className="relative">
          {/* Image */}
          <img
            src={
              preview?.image ||
              profileImage?.url ||
              `/images/icon-7797704_640.png`
            }
            alt="User Profile"
            className="size-45 rounded-full object-contain border border-light-border-primary dark:border-dark-border-primary"
          />

          {/* Overlay */}
          {imageLoading ? (
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-100 backdrop-blur-xs transition flex items-center justify-center">
              <div className="text-white text-sm bg-black/40 p-2 rounded-full">
                <Loader size={20} className="text-light-text-secondary dark:text-dark-text-secondary animate-spin" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 hover:opacity-100 hover:backdrop-blur-xs transition flex items-center justify-center">
              <button
                type="button"
                className="p-2 text-sm text-white bg-black/40 flex items-center gap-3 rounded-full"
              >
                <div
                  onClick={deleteProfileImage}
                  className="p-2 text-red-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 bg-black/50 rounded-full cursor-pointer transition-colors"
                >
                  <Trash2 size={20} />
                </div>

                <div
                  onClick={() => imageInputRef.current.click()}
                  className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 bg-black/50 rounded-full cursor-pointer transition-colors"
                >
                  <SquarePen size={20} />
                </div>
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            className="hidden"
            onChange={(e) => uploadFile(e, "image", updateProfileImage)}
          />
        </div>
      </div>

      {/* First Name */}
      <LabelInput
        id="firstName"
        label="First Name"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="firstName"
          type="text"
          placeholder="First Name"
          {...register("firstName", {
            required: "First Name is required!",
          })}
          error={errors.firstName}
        />

        <FieldError error={errors.firstName?.message} />
      </LabelInput>

      {/* Middle Name */}
      <LabelInput
        id="middleName"
        label="Middle Name"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="middleName"
          type="text"
          placeholder="Middle Name"
          {...register("middleName", {})}
          error={errors.middleName}
        />
      </LabelInput>

      {/* Last Name */}
      <LabelInput
        id="lastName"
        label="Last Name"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="lastName"
          type="text"
          placeholder="Last Name"
          {...register("lastName")}
          error={errors.lastName}
        />
      </LabelInput>

      {/* Username */}
      <LabelInput
        id="username"
        label="Username"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="username"
          type="text"
          placeholder="username"
          {...register("username", {
            required: "username is required!",
          })}
          error={errors.username}
        />

        <FieldError error={errors.username?.message} />
      </LabelInput>

      {/* Email */}
      <LabelInput
        id="email"
        label="Email"
        attachment={
          <div className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer">
            <Edit size={13} /> <p>Update Email</p>
          </div>
        }
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="email"
          type="text"
          placeholder="email"
          {...register("email", {
            required: "email is required!",
          })}
          disabled
          error={errors.email}
        />
      </LabelInput>

      {/* Mobile No. */}
      <LabelInput
        id="mobileNo"
        label="Mobile No."
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="mobileNo"
          type="tel"
          placeholder="mobile no."
          {...register("mobileNo", {
            required: "Mobile No. is required!",
            minLength: 10,
            maxLength: 10,
          })}
          error={errors.mobileNo}
        />

        <FieldError error={errors.mobileNo?.message} />
      </LabelInput>

      {/* Gender */}
      <LabelInput
        id="gender"
        label="Gender"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomRadioButtons
          name="gender"
          options={genders}
          {...register("gender", {
            required: "Gender is required!",
          })}
          error={errors.gender}
        />

        <FieldError error={errors.gender?.message} />
      </LabelInput>

      <div className="hidden lg:block col-span-6"></div>

      {/* Resume PDF - Drag & Drop */}
      <LabelInput
        id="resumeOrCv"
        label="Resume PDF"
        colSpan="row-span-3 col-span-12 sm:col-span-6 lg:col-span-3"
        className="order-[98] lg:order-0"
        required
      >
        <ResumeDropZone
          fileInputRef={fileInputRef}
          preview={preview}
          resumeOrCv={resumeOrCv}
          resumeLoading={resumeLoading}
          uploadFile={uploadFile}
          updateResume={updateResume}
          deleteResume={deleteResume}
        />
      </LabelInput>

      {/* Headline */}
      <LabelInput
        id="headline"
        label="Headline"
        colSpan="row-span-3 col-span-12 lg:col-span-3"
      >
        <CustomTextArea
          id="headline"
          type="textarea"
          placeholder="Headline"
          className="h-full min-h-37.5"
          {...register("headline", {
            maxLength: 100,
          })}
          error={errors.headline}
        />

        <FieldError error={errors.headline?.message} />
      </LabelInput>

      {/* About */}
      <LabelInput
        id="about"
        label="About"
        colSpan="row-span-3 col-span-12 lg:col-span-6"
      >
        <CustomTextArea
          id="about"
          type="textarea"
          placeholder="About"
          className="h-full min-h-37.5"
          {...register("about", {
            maxLength: {
              value: 1000,
              message: "Max 1000 characters allowed!",
            },
          })}
          error={errors.about}
        />

        <FieldError error={errors.about?.message} />
      </LabelInput>

      {/* Resume Link */}
      <LabelInput
        id="documentUrl"
        label="Resume Link (Optional)"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        className="order-[99] lg:order-0"
      >
        <CustomInput
          id="documentUrl"
          type="text"
          placeholder="e.g. Google Drive link"
          {...register("documentUrl", {
            pattern: {
              value: /^https:\/\/.+$/,
              message: "URL must start with https://",
            },
          })}
          error={errors.documentUrl}
        />
      </LabelInput>

      {/* City */}
      <LabelInput
        id="city"
        label="City"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="city"
          type="text"
          placeholder="e.g. Google Drive link"
          {...register("location.city", {})}
          error={errors.location?.city}
        />
      </LabelInput>

      {/* State */}
      <LabelInput
        id="state"
        label="State"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="state"
          type="text"
          placeholder="e.g. Google Drive link"
          {...register("location.state", {})}
          error={errors.location?.state}
        />
      </LabelInput>

      {/* Country */}
      <LabelInput
        id="country"
        label="Country"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="country"
          type="text"
          placeholder="e.g. Google Drive link"
          {...register("location.country", {})}
          error={errors.location?.country}
        />
      </LabelInput>

      <CustomButton
        type="submit"
        className="col-span-12 place-self-end order-last lg:order-0"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
