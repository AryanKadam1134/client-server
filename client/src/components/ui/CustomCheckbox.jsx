import React from "react";

import FieldError from "./FieldError";

export default function CustomCheckbox({ error, ...props }) {
  return (
    <>
      <input
        {...props}
        type="checkbox"
        className="accent-blue-500 dark:accent-blue-400 cursor-pointer"
      />

      <FieldError error={error} />
    </>
  );
}
