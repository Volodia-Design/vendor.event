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
  const [dropdownPosition, setDropdownPosition] = React.useState("bottom");
  const dropdownRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const dropdownListRef = React.useRef(null);

  // Calculate dropdown position
  React.useEffect(() => {
    if (isOpen && triggerRef.current && dropdownListRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownListRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Find the closest parent with overflow: auto/scroll
      let parent = triggerRef.current.parentElement;
      let scrollParent = null;
      
      while (parent && parent !== document.body) {
        const overflow = window.getComputedStyle(parent).overflow;
        if (overflow === 'auto' || overflow === 'scroll') {
          scrollParent = parent;
          break;
        }
        parent = parent.parentElement;
      }

      const parentRect = scrollParent 
        ? scrollParent.getBoundingClientRect() 
        : { top: 0, bottom: windowHeight };

      const bottomSpace = parentRect.bottom - triggerRect.bottom;
      const topSpace = triggerRect.top - parentRect.top;
      const dropdownHeight = dropdownRect.height;

      if (bottomSpace < dropdownHeight && topSpace > bottomSpace) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

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
      <div className="relative mt-1">
        <div
          ref={triggerRef}
          className="border rounded-lg p-2 flex items-start flex-wrap gap-1 cursor-pointer inputSelectStyle min-h-[42px]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="bg-gray-100 px-2 rounded-md text-sm flex items-center gap-1"
              >
                {option.name}
                <button
                  className="ml-1 text-gray-500 hover:text-red-500"
                  onClick={(e) => removeValue(option.id.toString(), e)}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-black-200 text-text4 lg:text-text3">
              {placeholder}
            </span>
          )}
          <img
            src="/Images/ComponentIcons/SelectArrow.svg"
            alt="arrow"
            className={cn(
              "absolute top-4 right-2 transition-transform w-3 h-3",
              isOpen ? "rotate-180" : ""
            )}
          />
        </div>

        {isOpen && (
          <div
            ref={dropdownListRef}
            className={cn(
              "absolute z-[9999] w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto",
              dropdownPosition === "top"
                ? "bottom-[calc(100%+4px)]"
                : "top-[calc(100%+4px)]"
            )}
            style={{
              maxHeight: "240px" 
            }}
          >
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
                    <Check className="w-4 h-4 rounded bg-secondary-700 text-white" />
                  )}
                </div>
                <span>{option.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-text4Medium">{error}</p>}
    </div>
  );
}