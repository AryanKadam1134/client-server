import React from "react";

export default function LabelInput({
  id,
  label,
  attachment,
  children,
  className = "",
  colSpan = "col-span-1",
  orientation = "vertical",
  type,
  bold,
  required,
}) {
  const isFile = type == "file";

  const isCheckbox = type == "checkbox";

  return (
    <div
      className={`${className} ${colSpan}
      flex ${!isCheckbox && orientation == "vertical" ? `flex-col gap-1.5` : `items-center gap-3 mt-5`}`}
    >
      {isCheckbox && children}

      <label
        htmlFor={id}
        className={`flex items-center justify-between font-medium text-sm dark:text-white
        ${bold && `font-semibold`}
        ${!isCheckbox && `whitespace-nowrap`}`}
      >
        <p>
          {label}
          {required && <span className="text-red-600"> *</span>}
          {orientation == "horizontal" && " :"}

          {isFile && <div className="mt-1">{children}</div>}
        </p>

        {attachment}
      </label>

      {!isCheckbox && !isFile && children}
    </div>
  );
}
