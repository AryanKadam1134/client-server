import React from "react";

import { inputClass } from "../../utils/getInputClass";

export default function CustomDatePicker({ error, className = "", ...props }) {
  return (
    <input
      {...props}
      type="date"
      className={`${inputClass(error)} ${className}`}
    />
  );
}
