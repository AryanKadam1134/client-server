import React from "react";

const variants = {
  default: {
    text_color: "text-white",
    bg_color: "bg-blue-500 hover:bg-blue-600",
  },
  red: {
    text_color: "text-white",
    bg_color: "bg-red-500 hover:bg-red-600",
  },
};

export default function CustomButton({
  className,
  children,
  variant = "default",
  ...props
}) {
  return (
    <button
      {...props}
      className={`shrink-0 px-5 py-2.5 ${variants[variant]?.text_color} ${variants[variant]?.bg_color} ${className} rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md`}
    >
      {children}
    </button>
  );
}
