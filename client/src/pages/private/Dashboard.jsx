import React, { useState, useRef, useEffect } from "react";

import { useForm } from "react-hook-form";
import { Loader, SquarePen, FileText } from "lucide-react";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useGenders from "../../hooks/useGenders";

export default function Dashboard() {
  const { genders } = useGenders();

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [imageUploading, setImageUploading] = useState(false);

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
  } = useForm();

  const profileImage = getValues("image");
  const resumeOrCv = getValues("resumeOrCv");

  const fetchUserDetails = async () => {
    try {
      const res = await apiEndpoints.getCurrentUser();

      const data = res.data;

      reset(data);
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
  };

  const updateProfileImage = async (file) => {
    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      await apiEndpoints.updateUserImage(formData);

      fetchUserDetails(); // refresh data
    } catch (error) {
      console.error("Error updating image:", error);
    } finally {
      setImageUploading(false);
    }
  };

  const updateResume = async (file) => {
    try {
      const formData = new FormData();
      formData.append("resumeOrCv", file);

      await apiEndpoints.updateUserResume(formData);

      fetchUserDetails(); // refresh data
    } catch (error) {
      console.error("Error updating resume:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-6 p-3 text-sm border-b border-gray-500"
      >
        <div className="row-span-3 col-span-12 sm:col-span-6 lg:col-span-3 flex items-center justify-center">
          <div className="relative">
            {/* Image */}
            <img
              src={preview?.image || profileImage?.url}
              alt="User Profile"
              className="size-45 rounded-full object-contain border border-gray-400"
            />

            {/* Overlay */}
            {imageUploading ? (
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-100 backdrop-blur-xs transition flex items-center justify-center">
                <div className="text-white text-sm bg-black/50 p-3 rounded-full">
                  <Loader size={20} className="text-gray-300 animate-spin" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 hover:opacity-100 hover:backdrop-blur-xs transition flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-white text-sm bg-black/50 p-3 rounded-full cursor-pointer"
                >
                  <SquarePen size={20} className="text-gray-300" />
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
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
        </LabelInput>

        {/* Email */}
        <LabelInput
          id="email"
          label="Email"
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
            minLength={10}
            maxLength={10}
            placeholder="mobile no."
            {...register("mobileNo", {
              required: "mobile no. is required!",
              minLength: 10,
              maxLength: 10,
            })}
            error={errors.mobileNo}
          />
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
        </LabelInput>

        <div className="col-span-6"></div>

        {/* City */}
        <LabelInput
          id="city"
          label="City"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-4"
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
          colSpan="col-span-12 sm:col-span-6 lg:col-span-4"
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
          colSpan="col-span-12 sm:col-span-6 lg:col-span-4"
        >
          <CustomInput
            id="country"
            type="text"
            placeholder="e.g. Google Drive link"
            {...register("location.country", {})}
            error={errors.location?.country}
          />
        </LabelInput>

        {/* Resume Link */}
        <LabelInput
          id="documentUrl"
          label="Resume Link (Optional)"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        >
          <CustomInput
            id="documentUrl"
            type="text"
            placeholder="e.g. Google Drive link"
            {...register("documentUrl", {})}
            error={errors.documentUrl}
          />
        </LabelInput>

        {/* Resume PDF */}
        <LabelInput
          id="resumeOrCv"
          label="Resume PDF"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          required
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => imageInputRef.current.click()}
              className="text-white text-sm bg-black/50 py-2 px-5 w-fit rounded cursor-pointer"
            >
              Choose File
            </button>

            {(preview?.resumeOrCv || resumeOrCv?.url) && (
              <FileText
                size={20}
                onClick={() =>
                  window.open(preview?.resumeOrCv || resumeOrCv?.url)
                }
              />
            )}
          </div>

          {/* Hidden File Input */}
          <input
            id="resumeOrCv"
            type="file"
            accept=".pdf"
            ref={imageInputRef}
            className="hidden"
            onChange={(e) => uploadFile(e, "resumeOrCv", updateResume)}
          />
        </LabelInput>

        <button
          type="submit"
          disabled={isSubmitting}
          className="col-span-12 place-self-end w-fit px-5 py-2 text-white bg-blue-500 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Saving" : "Save"}
        </button>
      </form>
    </div>
  );
}
