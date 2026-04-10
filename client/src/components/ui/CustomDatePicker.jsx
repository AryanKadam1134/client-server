import React from "react";

import { commonInputClass } from "../../constants";

const errorClass = (error) => {
  return error
    ? "border-2 border-red-400"
    : "border-gray-400 focus:border-transparent focus:ring focus:ring-blue-400";
};

export default function CustomDatePicker({ error, className = "", ...props }) {
  return (
    <input
      {...props}
      type="date"
      className={`${commonInputClass} ${errorClass(error)} ${className}`}
    />
  );
}
