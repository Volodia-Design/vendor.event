import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { cn } from "../utils"; // Add this import
import * as React from "react"; // Add this import

export function SelectComponent({
  id,
  label,
  value,
  onChange,
  options,
  className,
  placeholder,
  withoutLabelMargin,
  error,
}) {
  const [isOpen, setIsOpen] = React.useState(false); // Add state for arrow rotation

  const handleValueChange = (newValue) => {
    if (onChange && newValue) {
      onChange(newValue);
    }
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className="text-text4Medium text-black-400">
          {label}
        </label>
      )}

      <Select
        id={id}
        value={value || ""} 
        onValueChange={handleValueChange}
        className="rounded-lg bg-white h-[42px]"
        onOpenChange={(open) => setIsOpen(open)} // Add this to handle open state
      >
        <SelectTrigger
          className={`inputSelectStyle ${
            withoutLabelMargin ? "mt-0" : "mt-1"
          } flex items-center justify-between`}
        >
          <SelectValue 
            placeholder={placeholder} 
            className="text-black-200 text-text4 lg:text-text3" 
          />
          <img
            src="/Images/ComponentIcons/SelectArrow.svg"
            alt="arrow"
            className={cn(
              "select-arrow transition-transform w-3 h-3",
              isOpen ? "rotate-180" : ""
            )}
          />
        </SelectTrigger>

        <SelectContent className="bg-white border-none">
          {options?.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id.toString()} 
              className="focus:bg-gray-100 focus:text-black cursor-pointer hover:bg-gray-100 px-4"
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-text4Medium">{error}</p>}
    </div>
  );
}