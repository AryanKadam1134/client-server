import React from "react";

import { commonInputClass } from "../../constants";

const errorClass = (error) => {
  return error
    ? "border-2 border-red-400"
    : "border-gray-400 focus:border-transparent focus:ring focus:ring-blue-400";
};

// Note: Use only for Text Based Inputs
export default function CustomTextArea({ error, className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`${commonInputClass} ${errorClass(error)} ${className}`}
    />
  );
}
