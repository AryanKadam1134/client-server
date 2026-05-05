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
          w-full min-h-40 flex flex-col items-center justify-center gap-3
          border-2 border-dashed border-light-border-secondary dark:border-dark-border-secondary rounded-md cursor-pointer
          transition-all duration-200 px-4 py-8 text-center
          ${isDragging && "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20"}
          ${!loading && "hover:bg-light-bg-secondary dark:hover:bg-dark-bg-hover hover:border-light-border-primary dark:hover:border-dark-border-primary"}
          ${className}
        `}
      >
        {loading ? (
          <Loader size={24} className="text-blue-500 dark:text-blue-400 animate-spin" />
        ) : (
          <>
            <FileText size={28} className="text-light-text-tertiary dark:text-dark-text-tertiary" />

            <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              <p>{text}</p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                OR
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Click to browse
              </p>
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
