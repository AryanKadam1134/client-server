import React from "react";

export default function CustomButton({
  text_prop = "text-white",
  bg_prop = "bg-blue-500 hover:bg-blue-600",
  className,
  children,
  ...props
}) {
  return (
    <button
      {...props}
      className={`shrink-0 px-5 py-2 ${text_prop} ${bg_prop} ${className} rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
    >
      {children}
    </button>
  );
}
