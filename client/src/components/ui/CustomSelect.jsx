import { useState } from "react";
import { useCombobox } from "downshift";

import { ChevronDown } from "lucide-react";

import { inputClass } from "../../utils/getInputClass";

export default function CustomSelect({
  options = [],
  error,
  value,
  onChange,
  placeholder = "Select...",
}) {
  const [inputValue, setInputValue] = useState("");
  const selectedItem = options.find((opt) => opt.value === value) || null;

  const filteredItems = options.filter((item) =>
    item.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    getToggleButtonProps,
  } = useCombobox({
    items: filteredItems,
    selectedItem: null, // 🔥 always null — we control display ourselves
    inputValue,
    itemToString: () => "", // 🔥 never let Downshift write the label into input

    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter: {
          const clicked = changes.selectedItem;
          if (clicked) {
            // toggle
            onChange(value === clicked.value ? null : clicked.value);
          }
          setInputValue("");
          return {
            ...changes,
            selectedItem: null,
            inputValue: "",
            isOpen: false,
          };
        }

        case useCombobox.stateChangeTypes.InputBlur: {
          setInputValue("");
          return { ...changes, inputValue: "" };
        }

        default:
          return changes;
      }
    },

    onInputValueChange: ({ inputValue: newVal }) => {
      // 🔥 Ignore Downshift trying to set the label as inputValue after selection
      if (newVal === selectedItem?.label) return;
      setInputValue(newVal || "");
    },
  });

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          {...getInputProps({
            onKeyDown: (e) => {
              if (e.key === "Backspace") {
                if (!inputValue && selectedItem) {
                  // 🔥 Start editing from the label
                  setInputValue(selectedItem.label.slice(0, -1));
                  onChange(null);
                }
              }
            },
          })}
          value={selectedItem && !inputValue ? selectedItem.label : inputValue}
          placeholder={placeholder}
          className={`${inputClass(error)} pr-10`}
        />

        <button
          type="button"
          {...getToggleButtonProps()}
          className="absolute right-2"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <ul
        {...getMenuProps()}
        className={`absolute z-50 flex flex-col gap-1 mt-1 p-1 w-full bg-white border border-gray-500 rounded-md shadow-md max-h-60 overflow-y-auto ${
          !isOpen ? "hidden" : ""
        }`}
      >
        {isOpen &&
          filteredItems.map((item, index) => {
            const isSelected = value === item.value;
            return (
              <li
                key={item.value}
                {...getItemProps({ item, index })}
                className={`px-3 py-2 flex items-center justify-between gap-1 w-full cursor-pointer text-sm rounded
                  ${highlightedIndex === index ? "bg-gray-200" : ""}
                  ${isSelected ? "font-medium bg-gray-200" : ""}
                `}
              >
                {item.label} {isSelected && "✔"}
              </li>
            );
          })}

        {isOpen && filteredItems.length === 0 && (
          <li className="px-3 py-2 text-sm">No results found</li>
        )}
      </ul>
    </div>
  );
}
