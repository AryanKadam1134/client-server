import React from "react";

export default function CustomRadioButtons({
  options = [],
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`flex items-center gap-4 mt-2 ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-1">
          <input
            id={option.value}
            type="radio"
            value={option.value}
            className="accent-blue-500 cursor-pointer"
            {...props}
          />

          <label htmlFor={option.value} className="dark:text-white cursor-pointer">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}
