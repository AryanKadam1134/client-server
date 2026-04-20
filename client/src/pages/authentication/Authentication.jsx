import React, { useState } from "react";

import { GoogleLogin } from "@react-oauth/google";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import FieldError from "../../components/ui/FieldError";
import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { apiEndpoints } from "../../api";

import { useAuth } from "../../context/AuthContext";

export default function Authentication() {
  const { login, googleAuth } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange", // 🔥 important
  });

  const rememberMe = useWatch({ control, name: "rememberMe" });

  const onSubmit = async (payload) => {
    try {
      if (isLogin) {
        await login(payload);

        navigate("/details");
      } else {
        const res = await apiEndpoints.register(payload);

        const data = res?.data;

        reset();
        setIsLogin(true);
        console.log("User Registered: ", data);
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Authentication</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="text-sm space-y-4">
          {/* First Name */}
          {!isLogin && (
            <LabelInput id="firstName" label="First Name" required>
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
          )}

          {/* Last Name */}
          {!isLogin && (
            <LabelInput id="lastName" label="Last Name">
              <CustomInput
                id="lastName"
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                error={errors.lastName}
              />
            </LabelInput>
          )}

          {/* Username */}
          {!isLogin && (
            <LabelInput id="username" label="Username" required>
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
          )}

          {/* User Credential */}
          {isLogin && (
            <LabelInput id="userCredential" label="Username or Email" required>
              <CustomInput
                id="userCredential"
                type="text"
                placeholder="username or email"
                {...register("userCredential", {
                  required: "username or email is required!",
                })}
                error={errors.userCredential}
              />

              <FieldError error={errors.userCredential?.message} />
            </LabelInput>
          )}

          {/* Email */}
          {!isLogin && (
            <LabelInput id="email" label="Email" required>
              <CustomInput
                id="email"
                type="email"
                placeholder="email"
                {...register("email", {
                  required: "email is required!",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email format",
                  },
                })}
                error={errors.email}
              />

              <FieldError error={errors.email?.message} />
            </LabelInput>
          )}

          {/* Password */}
          <LabelInput id="password" label="Password" required>
            <CustomInputPassword
              id="password"
              placeholder="password"
              {...register("password", {
                required: "password is required!",
                minLength: {
                  value: 8,
                  message: "Minimum 6 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Maximum 16 characters",
                },
              })}
              className="pr-10"
              error={errors.password}
            />

            {!isLogin && <FieldError error={errors.password?.message} />}
          </LabelInput>

          {/* Remember Me */}
          {isLogin && (
            <LabelInput id="rememberMe" label="Remember Me?" type="checkbox">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                error={errors?.rememberMe}
              />
            </LabelInput>
          )}

          {/* Submit */}
          <CustomButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </CustomButton>

          <GoogleLogin
            onSuccess={(credentialResponse) =>
              googleAuth(credentialResponse, rememberMe)
            }
            theme="outlined"
            size="large"
            shape="pill"
            text={isLogin ? "signin_with" : "signup_with"}
            width="100%"
          />

          <p
            onClick={() => {
              setIsLogin((prev) => !prev);
              reset();
            }}
            className="text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </p>
        </form>
      </div>
    </div>
  );
}
