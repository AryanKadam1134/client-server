import React, { useState } from "react";

import { inputClass } from "../../constants";

const errorClass = (error) => {
  return error ? "border-2 border-red-400" : "border-gray-400";
};

// Note: Use only for Text Based Inputs
export default function CustomInput({ error, className, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type == "password";

  return (
    <div className="relative">
      <input
        {...props}
        type={isPassword && showPassword ? "text" : type}
        className={`${inputClass} ${errorClass(error)} ${className}`}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
}
