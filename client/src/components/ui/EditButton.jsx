import React from "react";

import { FilePenLine } from "lucide-react";

export default function EditButton({ ...props }) {
  return (
    <button
      {...props}
      className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-md transition-all shadow-sm hover:shadow-md enabled:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <FilePenLine size={18} />
    </button>
  );
}
