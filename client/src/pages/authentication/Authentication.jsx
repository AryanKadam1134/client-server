import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { apiEndpoints } from "../../api";

import { useAuth } from "../../context/AuthContext";
import LabelInput from "../../components/ui/LabelInput";

export default function Authentication() {
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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

        console.log("User Registered: ", data);
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const getInputClass = (error) =>
    `w-full px-3 py-2 border rounded-sm shadow-md outline-none 
   ${error ? "border-2 border-red-400" : "border-gray-400"} 
   focus:border-transparent focus:ring focus:ring-blue-400 focus:bg-slate-100`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Authentication</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="text-sm space-y-4">
          {/* Full Name */}
          {!isLogin && (
            <LabelInput id="fullName" label="Full Name" required>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                {...register("fullName", {
                  required: "Full Name is required!",
                })}
                className={getInputClass(errors.fullName)}
              />
            </LabelInput>
          )}

          {/* Username */}
          {!isLogin && (
            <LabelInput id="username" label="Username" required>
              <input
                id="username"
                type="text"
                placeholder="username"
                {...register("username", {
                  required: "username is required!",
                })}
                className={getInputClass(errors.username)}
              />
            </LabelInput>
          )}

          {/* User Credential */}
          {isLogin && (
            <LabelInput id="userCredential" label="Username or Email" required>
              <input
                id="userCredential"
                type="text"
                placeholder="username or email"
                {...register("userCredential", {
                  required: "username or email is required!",
                })}
                className={getInputClass(errors.userCredential)}
              />

              {errors.userCredential && (
                <p className="text-red-500 text-sm">
                  {errors.userCredential.message}
                </p>
              )}
            </LabelInput>
          )}

          {/* Email */}
          {!isLogin && (
            <LabelInput id="username" label="Email" required>
              <input
                type="email"
                placeholder="email"
                {...register("email", {
                  required: "email is required!",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email format",
                  },
                })}
                className={getInputClass(errors.email)}
              />
            </LabelInput>
          )}

          {/* Password */}
          <LabelInput id="password" label="Password" required>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                {...register("password", {
                  required: "password is required!",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className={`${getInputClass(errors.password)} pr-10`}
              />

              {/* 👁️ Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
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
