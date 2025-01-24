import * as React from "react";
import { Check } from "lucide-react"; 
import { cn } from "../utils";

export function MultiSelectComponent({
  id,
  label,
  value = [],
  onChange,
  options,
  className,
  placeholder,
  error,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionId) => {
    const newValue = value.includes(optionId)
      ? value.filter((v) => v !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  const removeValue = (optionId, e) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionId);
    onChange(newValue);
  };

  const selectedOptions = options.filter((option) =>
    value.includes(option.id.toString())
  );

  return (
    <div className={className} ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="text-text4Medium text-black-400">
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className="mt-1 border rounded-lg p-2 min-h-[40px] flex items-center flex-wrap gap-1 cursor-pointer inputSelectStyle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="bg-gray-100 px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {option.name}
                <button
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={(e) => removeValue(option.id.toString(), e)}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-black-200">{placeholder}</span>
          )}
          <img
            src="/Images/ComponentIcons/SelectArrow.svg"
            alt="arrow"
            className={cn(
              "ml-auto transition-transform w-4 h-4",
              isOpen ? "rotate-180" : ""
            )}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer",
                  value.includes(option.id.toString()) && "bg-gray-50"
                )}
                onClick={() => handleSelect(option.id.toString())}
              >
                <div className="w-4 h-4 border rounded flex items-center justify-center">
                  {value.includes(option.id.toString()) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <span>{option.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-4Medium">{error}</p>
      )}
    </div>
  );
}
