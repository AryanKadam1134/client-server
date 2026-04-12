import { useCombobox, useMultipleSelection } from "downshift";
import { useState } from "react";
import { commonInputClass } from "../../constants";
import { ChevronDown, X } from "lucide-react";

const errorClass = (error) => {
  return error
    ? "border-2 border-red-400"
    : "border-gray-400 focus:border-transparent focus:ring focus:ring-blue-400";
};

export default function CustomMultiSelect({
  options = [],
  value = [],
  onChange,
  error,
  placeholder = "Select...",
}) {
  // ✅ map value -> objects
  const selectedItems = options.filter((opt) => value.includes(opt.value));

  const [inputValue, setInputValue] = useState("");

  // ✅ MULTI SELECTION
  const { getSelectedItemProps, removeSelectedItem } = useMultipleSelection({
    selectedItems,

    onStateChange: ({ selectedItems: newItems }) => {
      if (!newItems) return;
      onChange(newItems.map((item) => item.value));
    },
  });

  // ✅ FILTERED OPTIONS (SEARCH)
  const filteredItems = options.filter((item) =>
    item.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // ✅ COMBOBOX
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    getToggleButtonProps,
  } = useCombobox({
    items: filteredItems,
    inputValue,

    // 🔥 FIX: prevents [object Object]
    itemToString: (item) => (item ? item.label : ""),

    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || "");
    },

    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) return;

      if (!value.includes(selectedItem.value)) {
        onChange([...value, selectedItem.value]);
      }

      setInputValue(""); // clear after select
    },
  });

  return (
    <div className="relative w-full">
      {/* Input + Chips */}
      <div
        className={`${commonInputClass} ${errorClass(
          error,
        )} flex flex-wrap items-center gap-2 pr-10`}
      >
        {/* Chips */}
        {selectedItems.map((item, index) => (
          <span
            key={item.value}
            {...getSelectedItemProps({ selectedItem: item, index })}
            className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded text-xs"
          >
            {item.label}

            <X
              size={12}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                removeSelectedItem(item);
              }}
            />
          </span>
        ))}

        {/* Input */}
        <input
          {...getInputProps({
            placeholder: selectedItems.length ? "" : placeholder,
            className:
              "flex-1 outline-none bg-transparent text-sm min-w-[80px]",
          })}
        />
      </div>

      {/* Toggle Button */}
      <button
        type="button"
        {...getToggleButtonProps()}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <ChevronDown size={18} />
      </button>

      {/* Dropdown */}
      <ul
        {...getMenuProps()}
        className={`absolute z-50 mt-1 w-full bg-white border border-gray-500 rounded-sm shadow-md max-h-60 overflow-y-auto ${
          !isOpen && "hidden"
        }`}
      >
        {isOpen &&
          filteredItems.map((item, index) => {
            const isSelected = value.includes(item.value);

            return (
              <li
                key={item.value}
                {...getItemProps({ item, index })}
                className={`px-3 py-2 cursor-pointer text-sm flex justify-between
                  ${highlightedIndex === index ? "bg-gray-200" : ""}
                  ${isSelected ? "font-medium bg-gray-200" : ""}
                `}
              >
                {item.label}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
