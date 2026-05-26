import React, { useState } from "react";

import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { LockKeyholeOpen, Mail } from "lucide-react";

import FieldError from "../../components/ui/FieldError";
import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { apiEndpoints } from "../../api";

import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../context/NotificationContext";

export default function Authentication() {
  const { error, setError, login, googleAuth } = useAuth();
  const { notify } = useNotify();

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
    if (isLogin) {
      await login(payload);
      navigate("/details");
    } else {
      try {
        const res = await apiEndpoints.register(payload);

        const data = res?.data;

        reset();
        setIsLogin(true);
        notify.msgSuccess("Account Created Successfully!");
        console.log("User Registered: ", data);
      } catch (error) {
        console.error("Login failed: ", error);
        notify.msgError("Registration Failed!");
        setError(error?.message);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="w-full max-w-md bg-light-bg-primary dark:bg-dark-bg-tertiary p-8 rounded-xl shadow-lg border border-light-border-primary dark:border-dark-border-primary">
        <h2 className="text-2xl font-bold text-center mb-6 text-light-text-primary dark:text-dark-text-primary">
          Profilo
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-sm"
        >
          {/* First Name */}
          {!isLogin && (
            <LabelInput id="firstName" label="First Name" required>
              <CustomInput
                id="firstName"
                type="text"
                placeholder="John"
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
                placeholder="Doe"
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
                placeholder="username / email"
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
                icon={Mail}
                placeholder="example@gmail.com"
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
          <LabelInput
            id="password"
            label="Password"
            attachment={
              isLogin && (
                <p
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  Forgot Password?
                </p>
              )
            }
            required
          >
            <CustomInputPassword
              id="password"
              icon={LockKeyholeOpen}
              placeholder="••••••••"
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

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

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

          <div className="flex items-center gap-3 text-xs">
            <p className="flex-1 border-b border-light-input-border dark:border-dark-input-border"></p>
            <p className="text-gray-400">OR</p>
            <p className="flex-1 border-b border-light-input-border dark:border-dark-input-border"></p>
          </div>

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

          <p className="mt-2 text-center text-xs text-light-text-primary dark:text-dark-text-primary">
            {isLogin
              ? "Don't have an account yet? "
              : "Already have an account? "}
            <span
              onClick={() => {
                setIsLogin((prev) => {
                  setError(null);
                  return !prev;
                });
                reset();
              }}
              className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
