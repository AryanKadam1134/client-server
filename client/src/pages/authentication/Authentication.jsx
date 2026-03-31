import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";

import { apiEndpoints } from "../../api";

import { useAuth } from "../../context/AuthContext";

export default function Authentication() {
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (payload) => {
    try {
      if (isLogin) {
        await login(payload);
        navigate("/admin");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Authentication</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="text-sm space-y-4">
          {/* Full Name */}
          {!isLogin && (
            <LabelInput id="fullName" label="Full Name" required>
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
            </LabelInput>
          )}

          {/* Password */}
          <LabelInput id="password" label="Password" required>
            <CustomInput
              id="password"
              type="password"
              placeholder="password"
              {...register("password", {
                required: "password is required!",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="pr-10"
              error={errors.password}
            />
          </LabelInput>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

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
