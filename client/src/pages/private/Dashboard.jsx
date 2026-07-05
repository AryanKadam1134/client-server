import React, { useState, useRef, useEffect } from "react";

import { useForm } from "react-hook-form";
import {
  Loader,
  SquarePen,
  FileText,
  Trash2,
  FilePenLine,
  Edit,
  Mail,
  Phone,
  Link,
} from "lucide-react";

import UserDetailsSkeleton from "../../components/user_details/UserDetailsSkeleton";

import FieldError from "../../components/ui/FieldError";
import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomTextArea from "../../components/ui/CustomTextArea";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { userEndpoints } from "../../services/userService";

import useGenders from "../../hooks/useGenders";

import { useAuth } from "../../context/auth/useAuth";
import { useNotify } from "../../context/notification/useNotify";

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
          border-2 border-dashed border-light-border-secondary dark:border-dark-border-secondary hover:border-light-border-primary dark:hover:border-dark-border-primary rounded-md cursor-pointer
          transition-all duration-200 px-4 py-5 text-center
          ${isDragging && "border-blue-400 dark:border-blue-500 bg-blue-500/10 dark:bg-blue-950/20"}
          ${!resumeLoading && "hover:bg-light-bg-secondary dark:hover:bg-dark-bg-hover"}
        `}
      >
        {resumeLoading ? (
          <>
            <Loader
              size={24}
              className="text-blue-500 dark:text-blue-400 animate-spin"
            />
          </>
        ) : hasFile ? (
          <>
            <div className="flex flex-col items-center gap-1">
              <img src="/images/pdf.svg" alt="pdf svg" className="size-8" />
              <p className="text-xs font-medium truncate text-light-text-primary dark:text-dark-text-primary w-full">
                {fileName}
              </p>
            </div>

            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Click to replace
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-1">
              <FileText
                size={24}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <div className="text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium">
                Drop your PDF here
                <br />
                OR
                <br />
                Click to browse
              </div>
            </div>

            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              PDF only
            </p>
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

  const [detailsLoading, setDetailsLoading] = useState(true);
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
      const res = await userEndpoints.getCurrentUser();

      const data = res.data;

      reset(data);
      setUser(data);
      // console.log("User Details: ", data);
    } catch (error) {
      console.error("Error fetching User Details: ", error);
      notify.msgError(error?.message || "Failed to load user details");
    } finally {
      setDetailsLoading(false);
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
      await userEndpoints.updateUser(updatedData);

      fetchUserDetails();
      notify.msgSuccess("Details Updated!");
    } catch (error) {
      console.error("Error updating User Details: ", error);
      notify.msgError(error?.message || "Failed to update user details");
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

      await userEndpoints.updateUserImage(formData);

      fetchUserDetails();
      notify.msgSuccess("Profile Image Updated!");
    } catch (error) {
      console.error("Error updating image:", error);
      notify.msgError(error?.message || "Failed to update profile image");
    } finally {
      setImageLoading(false);
    }
  };

  const deleteProfileImage = async () => {
    setImageLoading(true);

    try {
      await userEndpoints.deleteUserImage();

      setPreview({});
      fetchUserDetails();
      notify.msgSuccess("Profile Image Deleted!");
    } catch (error) {
      console.error("Error deleting image:", error);
      notify.msgError(error?.message || "Failed to delete profile image");
    } finally {
      setImageLoading(false);
    }
  };

  const updateResume = async (file) => {
    setResumeLoading(true);
    try {
      const formData = new FormData();
      formData.append("resumeOrCv", file);

      await userEndpoints.updateUserResume(formData);

      fetchUserDetails();
      notify.msgSuccess("Resume Updated!");
    } catch (error) {
      console.error("Error updating resume:", error);
      notify.msgError(error?.message || "Failed to update resume");
    } finally {
      setResumeLoading(false);
    }
  };

  const deleteResume = async () => {
    setResumeLoading(true);

    try {
      await userEndpoints.deleteUserResume();

      setPreview({});
      fetchUserDetails();
      notify.msgSuccess("Resume Updated!");
    } catch (error) {
      console.error("Error deleting resume:", error);
      notify.msgError(error?.message || "Failed to delete resume");
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

  if (detailsLoading) {
    return <UserDetailsSkeleton />;
  }

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
            src={preview?.image || profileImage?.url || `/images/profile.png`}
            alt="User Profile"
            className="size-45 rounded-full object-contain border border-light-border-primary dark:border-dark-border-primary"
          />

          {/* Overlay */}
          {imageLoading ? (
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-100 backdrop-blur-xs transition flex items-center justify-center">
              <div className="text-white text-sm bg-black/40 p-2 rounded-full">
                <Loader
                  size={20}
                  className="text-light-text-secondary dark:text-dark-text-secondary animate-spin"
                />
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
          placeholder="Enter your first name"
          {...register("firstName", {
            required: "First name is required!",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
            maxLength: {
              value: 50,
              message: "First name must not exceed 50 characters",
            },
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
          placeholder="Enter middle name (optional)"
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
          placeholder="Enter your last name"
          {...register("lastName", {
            maxLength: {
              value: 50,
              message: "Last name must not exceed 50 characters",
            },
          })}
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
          placeholder="Enter a unique username"
          {...register("username", {
            required: "Username is required!",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            maxLength: {
              value: 30,
              message: "Username must not exceed 30 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]+$/,
              message:
                "Username can only contain letters, numbers, hyphens, and underscores",
            },
          })}
          error={errors.username}
        />

        <FieldError error={errors.username?.message} />
      </LabelInput>

      {/* Email */}
      <LabelInput
        id="email"
        label="Email"
        // attachment={
        //   <div className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer">
        //     <Edit size={13} /> <p>Update Email</p>
        //   </div>
        // }
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="email"
          type="email"
          icon={Mail}
          placeholder="your.email@example.com"
          {...register("email", {
            required: "Email is required!",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
          disabled
          error={errors.email}
        />

        <FieldError error={errors.email?.message} />
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
          icon={Phone}
          placeholder="Enter 10-digit phone number"
          {...register("mobileNo", {
            required: "Mobile number is required!",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Mobile number must be exactly 10 digits",
            },
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
        label="Professional Headline"
        colSpan="row-span-3 col-span-12 lg:col-span-3"
      >
        <CustomTextArea
          id="headline"
          type="textarea"
          placeholder="e.g., Full Stack Developer | React & Node.js Expert"
          className="h-full min-h-37.5"
          {...register("headline", {
            maxLength: {
              value: 100,
              message: "Headline must not exceed 100 characters",
            },
          })}
          error={errors.headline}
        />

        <FieldError error={errors.headline?.message} />
      </LabelInput>

      {/* About */}
      <LabelInput
        id="about"
        label="About You"
        colSpan="row-span-3 col-span-12 lg:col-span-6"
      >
        <CustomTextArea
          id="about"
          type="textarea"
          placeholder="Tell us about yourself, your experience, and what you're passionate about..."
          className="h-full min-h-37.5"
          {...register("about", {
            maxLength: {
              value: 1000,
              message: "About section must not exceed 1000 characters",
            },
          })}
          error={errors.about}
        />

        <FieldError error={errors.about?.message} />
      </LabelInput>

      {/* Resume Link */}
      <LabelInput
        id="documentUrl"
        label="Resume Link"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        className="order-[99] lg:order-0"
      >
        <CustomInput
          id="documentUrl"
          type="text"
          icon={Link}
          placeholder="https://drive.google.com/... (optional)"
          {...register("documentUrl", {
            pattern: {
              value: /^(https:\/\/.+)?$/,
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
          placeholder="Enter your city"
          {...register("location.city", {
            maxLength: {
              value: 50,
              message: "City name must not exceed 50 characters",
            },
          })}
          error={errors.location?.city}
        />
      </LabelInput>

      {/* State */}
      <LabelInput
        id="state"
        label="State / Province"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="state"
          type="text"
          placeholder="Enter your state or province"
          {...register("location.state", {
            maxLength: {
              value: 50,
              message: "State name must not exceed 50 characters",
            },
          })}
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
          placeholder="Enter your country"
          {...register("location.country", {
            maxLength: {
              value: 50,
              message: "Country name must not exceed 50 characters",
            },
          })}
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
