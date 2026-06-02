import React from "react";

import { FilePenLine, Trash2 } from "lucide-react";

const variants = {
  edit: {
    icon: FilePenLine,
    style: "text-white bg-green-500 hover:bg-green-600",
  },
  delete: { icon: Trash2, style: "text-white bg-red-500 hover:bg-red-600" },
};

export default function ActionButton({ variant, ...props }) {
  const buttonStyle = variants[variant];
  const Icon = variants[variant]?.icon;

  return (
    <button
      {...props}
      className={`p-2 ${buttonStyle?.style}
      rounded-md shadow-sm hover:shadow-md transition-all
      enabled:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      <Icon size={18} />
    </button>
  );
}
