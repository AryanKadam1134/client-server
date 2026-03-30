import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { apiEndpoints } from "../../api";
import { useNavigate } from "react-router-dom";
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

        console.log("User Registered: ", data);
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Authentication</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          {/* Username */}
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "Username is required",
                })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
          )}

          {/* User Credential */}
          {isLogin && (
            <div>
              <input
                type="text"
                placeholder="username or email"
                {...register("userCredential", {
                  required: "userCredential is required",
                })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.userCredential && (
                <p className="text-red-500 text-sm">
                  {errors.userCredential.message}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          {!isLogin && (
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

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
