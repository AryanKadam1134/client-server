import React from "react";

import { FilePenLine } from "lucide-react";

export default function EditButton({ ...props }) {
  return (
    <button
      {...props}
      className="p-1 text-white bg-green-500 hover:bg-green-600 rounded transition-colors enabled:cursor-pointer disabled:opacity-60 loading:cursor-progress"
    >
      <FilePenLine size={18} />
    </button>
  );
}
