import React, { useEffect, useState } from "react";

import { useForm, useWatch } from "react-hook-form";

import LabelInput from "../../components/ui/LabelInput";
import FieldError from "../../components/ui/FieldError";
import CustomButton from "../../components/ui/CustomButton";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { apiEndpoints } from "../../api";
import { useNotify } from "../../context/NotificationContext";

export default function ChangePassword() {
  const { notify } = useNotify();

  const [hasPassword, setHasPassword] = useState();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange", // 🔥 important
  });

  // Watch password fields for real-time validation
  const newPassword = watch("new_password");

  const changePassword = async (payload) => {
    try {
      await apiEndpoints.changePassword(payload);

      reset();
      notify.msgSuccess("Password changed successfully!");
    } catch (error) {
      console.error("Error Changing Password: ", error);
    }
  };

  useEffect(() => {
    const checkPassword = async () => {
      try {
        const res = await apiEndpoints.checkPassword();

        const data = res.data;

        reset({ isInitializing: !data });
        setHasPassword(data);
      } catch (error) {
        console.error("Error checking password: ", error);
      }
    };

    checkPassword();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(changePassword)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Old Password */}
      {hasPassword && (
        <LabelInput
          id="old_password"
          label="Current Password"
          colSpan="col-span-12 sm:col-span-6"
          required
        >
          <CustomInputPassword
            id="old_password"
            placeholder="Enter your current password"
            {...register("old_password", {
              required: "Current password is required!",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 16,
                message: "Password must not exceed 16 characters",
              },
            })}
            className="pr-10"
            error={errors.old_password}
          />

          <FieldError error={errors.old_password?.message} />
        </LabelInput>
      )}

      {/* New Password */}
      <LabelInput
        id="new_password"
        label="New Password"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInputPassword
          id="new_password"
          placeholder="Create a new password"
          {...register("new_password", {
            required: "New password is required!",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 16,
              message: "Password must not exceed 16 characters",
            },
          })}
          className="pr-10"
          error={errors.new_password}
        />

        <FieldError error={errors.new_password?.message} />
      </LabelInput>

      {/* Confirm Password */}
      <LabelInput
        id="confirm_password"
        label="Confirm New Password"
        colSpan="col-span-12 sm:col-span-6"
        required
      >
        <CustomInputPassword
          id="confirm_password"
          placeholder="Re-enter your new password"
          {...register("confirm_password", {
            required: "Please confirm your password!",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 16,
              message: "Password must not exceed 16 characters",
            },
            validate: (value) => {
              if (value !== newPassword) {
                return "Passwords do not match!";
              }
              return true;
            },
          })}
          className="pr-10"
          error={errors.confirm_password}
        />

        <FieldError error={errors.confirm_password?.message} />
      </LabelInput>

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
