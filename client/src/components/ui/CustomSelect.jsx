import React from "react";

import { commonInputClass } from "../../constants";

const errorClass = (error) => {
  return error
    ? "border-2 border-red-400"
    : "border-gray-400 focus:border-transparent focus:ring focus:ring-blue-400";
};

export default function CustomSelect({
  error,
  className = "",
  options,
  ...props
}) {
  return (
    <select
      {...props}
      className={`${className} ${commonInputClass} ${errorClass(error)}`}
    >
      {options?.map((option, idx) => (
        <option key={option?.value || idx} value={option?.value}>
          {option?.label}
        </option>
      ))}
    </select>
  );
}
