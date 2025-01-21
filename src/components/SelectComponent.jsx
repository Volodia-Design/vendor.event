import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

export function SelectComponent({
  id,
  label,
  value,
  onChange,
  options,
  className,
  placeholder,
  withoutLabelMargin,
}) {
  // Add default value handling
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
        value={value || ""} // Ensure value is never undefined
        onValueChange={handleValueChange}
        className="rounded-lg bg-white"
      >
        <SelectTrigger className={`inputSelectStyle ${withoutLabelMargin ? "mt-0" : "mt-1"}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="bg-white border-none">
          {options?.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id.toString()} // Convert id to string
              className="focus:bg-gray-100 focus:text-black cursor-pointer hover:bg-gray-100"
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}