import React, { useRef, useState } from "react";

import { Trash2, Loader, FileText } from "lucide-react";

export default function DragDropUpload({
  onChange,
  loading = false,
  text = "Drop files here",
  className = "",
  ...props // ✅ accept multiple, accept, etc.
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files?.length) return;

    onChange?.(files); // ✅ always pass FileList
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    onChange?.(files); // ✅ always pass FileList
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current.click()}
        className={`
          w-full min-h-32 flex flex-col items-center justify-center gap-3
          border-2 border-dashed border-gray-500 rounded-lg cursor-pointer
          transition-all duration-200 px-4 py-5 text-center
          ${isDragging && "border-blue-400 bg-blue-500/10"}
          ${!loading && "hover:bg-gray-200 hover:border-gray-600"}
          ${className}
        `}
      >
        {loading ? (
          <Loader size={24} className="text-blue-400 animate-spin" />
        ) : (
          <>
            <FileText size={24} className="text-gray-500" />

            <div className="text-gray-500 text-xs font-medium">
              {text}
              <br />
              OR
              <br />
              Click to browse
            </div>
          </>
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
        {...props} // ✅ multiple, accept, etc.
      />
    </>
  );
}
