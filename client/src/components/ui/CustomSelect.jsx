import { useCombobox } from "downshift";
import { commonInputClass } from "../../constants";
import { ChevronDown } from "lucide-react";

const errorClass = (error) => {
  return error
    ? "border-2 border-red-400"
    : "border-gray-400 focus:border-transparent focus:ring focus:ring-blue-400";
};

export default function CustomSelect({
  options = [],
  error,
  value,
  onChange,
  placeholder = "Select...",
}) {
  const selectedItem = options.find((opt) => opt.value === value) || null;

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    getToggleButtonProps,
  } = useCombobox({
    items: options,
    selectedItem,
    itemToString: (item) => item?.label || "",

    onSelectedItemChange: ({ selectedItem }) => {
      onChange(selectedItem?.value);
    },
  });

  return (
    <div className="relative w-full">
      {/* Input */}
      <div className="relative flex items-center">
        <input
          {...getInputProps({
            placeholder,
          })}
          className={`${commonInputClass} ${errorClass(error)} pr-10`}
        />

        <button
          type="button"
          {...getToggleButtonProps()}
          className="absolute right-2"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Dropdown */}
      <ul
        {...getMenuProps()}
        className={`absolute z-50 mt-1 w-full bg-white border rounded-sm shadow-md max-h-60 overflow-y-auto ${
          !isOpen && "hidden"
        }`}
      >
        {isOpen &&
          options.map((item, index) => (
            <li
              key={item.value}
              {...getItemProps({ item, index })}
              className={`px-3 py-2 cursor-pointer text-sm
                ${highlightedIndex === index ? "bg-gray-100" : ""}
              `}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
