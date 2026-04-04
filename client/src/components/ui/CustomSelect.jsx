import React, { useState, useRef, useEffect } from "react";
import { commonInputClass } from "../../constants";
import { ChevronDown } from "lucide-react";

const errorClass = (error) => {
  return error
    ? "border-2 border-red-400"
    : "border-gray-400 focus:border-transparent focus:ring focus:ring-blue-400";
};

export default function CustomSelect({
  error,
  className = "",
  options = [],
  value,
  onChange,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input-like Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`
          ${commonInputClass}
          ${errorClass(error)}
          ${className}
          flex items-center justify-between gap-3 cursor-pointer
        `}
      >
        <span className={`${!selectedOption ? "text-gray-400" : ""}`}>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-md max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
