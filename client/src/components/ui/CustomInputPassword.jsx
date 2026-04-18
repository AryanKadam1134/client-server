import React, { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { commonInputClass } from "../../constants";

const errorClass = (error) => {
  return error
    ? "border-2 border-red-400"
    : "border-gray-400 focus:border-transparent focus:ring focus:ring-blue-400";
};

// Note: Use only for Text Based Inputs
export default function CustomInputPassword({ error, className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`${commonInputClass} ${errorClass(error)} ${className}`}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
