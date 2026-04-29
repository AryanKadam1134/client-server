import React from "react";

import { inputClass } from "../../utils/getInputClass";

// Note: Use only for Text Based Inputs
export default function CustomInput({ error, className = "", ...props }) {
  return <input {...props} className={`${inputClass(error)} ${className}`} />;
}
