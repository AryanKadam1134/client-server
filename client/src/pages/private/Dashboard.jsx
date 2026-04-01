import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useGenders from "../../hooks/useGenders";

export default function Dashboard() {
  const { genders } = useGenders();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm();
  // console.log("Update User Payload: ", getValues());

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
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="text-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-6"
      >
        <LabelInput
          id="fullName"
          label="Full Name"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          required
        >
          <CustomInput
            id="fullName"
            type="text"
            placeholder="Full Name"
            {...register("fullName", {
              required: "Full Name is required!",
            })}
            error={errors.fullName}
          />
        </LabelInput>

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

        <LabelInput
          id="mobileNo"
          label="Mobile No."
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          required
        >
          <CustomInput
            id="mobileNo"
            type="tel"
            min={0}
            maxLength={10}
            placeholder="mobile no."
            {...register("mobileNo", {
              required: "mobileNo is required!",
              min: 0,
              maxLength: 10,
            })}
            error={errors.mobileNo}
          />
        </LabelInput>

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="col-span-3 px-3 py-2 text-white bg-blue-500 rounded-sm cursor-pointer"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
