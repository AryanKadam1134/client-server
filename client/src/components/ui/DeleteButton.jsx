import React from "react";

import { Trash2 } from "lucide-react";

export default function DeleteButton({ ...props }) {
  return (
    <button
      {...props}
      className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-all shadow-sm hover:shadow-md enabled:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Trash2 size={18} />
    </button>
  );
}
