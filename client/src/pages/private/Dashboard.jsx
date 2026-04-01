import React, { useState, useRef, useEffect } from "react";

import { useForm } from "react-hook-form";
import { SquarePen } from "lucide-react";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useGenders from "../../hooks/useGenders";

export default function Dashboard() {
  const { genders } = useGenders();

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm();
  // console.log("Update User Payload: ", getValues());

  const profileImage = getValues("image");

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
      updated[key] = data[key];
    }

    return updated;
  };

  const onSubmit = async (data) => {
    const updatedData = getUpdatedFields(data, dirtyFields);

    console.log("Only Updated Fields:", updatedData);

    try {
      await apiEndpoints.updateUser(data);
      fetchUserDetails();
    } catch (error) {
      console.error("Error updating User Details: ", error);
    }
  };

  const updateProfileImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Preview (instant UI feedback)
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    try {
      const formData = new FormData();
      formData.append("image", file);

      await apiEndpoints.updateUserImage(formData);

      fetchUserDetails(); // refresh data
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-6 p-3 border-b border-gray-500"
      >
        <div className="row-span-3 col-span-12 sm:col-span-6 lg:col-span-3 flex items-center justify-center">
          <div className="relative group">
            {/* Image */}
            <img
              src={preview || profileImage?.url}
              alt="User Profile"
              className="size-45 rounded-full object-contain border"
            />

            {/* Overlay */}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-white text-sm bg-black/60 p-3 rounded-full"
              >
                <SquarePen size={20} className="text-gray-300" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={updateProfileImage}
            />
          </div>
        </div>

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
