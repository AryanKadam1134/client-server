import React, { useState } from "react";

import { inputClass } from "../../utils/getInputClass";

// Note: Use only for Text Based Inputs
export default function CustomInput({ error, className = "", type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type == "password";

  return (
    <div className="relative">
      <input
        {...props}
        type={isPassword && showPassword ? "text" : type}
        className={`${inputClass(error)} ${className}`}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
}
