import React from "react";

import { Trash2 } from "lucide-react";

export default function DeleteButton({ ...props }) {
  return (
    <button
      {...props}
      className="p-1 text-white bg-red-500 hover:bg-red-600 rounded transition-colors enabled:cursor-pointer disabled:opacity-60 loading:cursor-progress"
    >
      <Trash2 size={18} />
    </button>
  );
}
