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
      flex ${!isCheckbox && orientation == "vertical" ? `flex-col gap-2` : `items-center gap-3 mt-5`}`}
    >
      {isCheckbox && children}

      <label
        htmlFor={id}
        className={`flex ${isCheckbox ? "flex-col" : "flex-row items-center"} justify-between font-medium text-sm text-light-text-primary dark:text-dark-text-primary
        ${bold && `font-semibold`}
        ${!isCheckbox && `whitespace-nowrap`}`}
      >
        <p>
          {label}
          {required && (
            <span className="text-red-600 dark:text-red-500"> *</span>
          )}
          {orientation == "horizontal" && " :"}

          {isFile && <div className="mt-1">{children}</div>}
        </p>

        {attachment}
      </label>

      {!isCheckbox && !isFile && children}
    </div>
  );
}
