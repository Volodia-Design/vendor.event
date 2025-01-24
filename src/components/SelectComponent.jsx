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
  error,
}) {
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
        className="rounded-lg bg-white"
      >
        <SelectTrigger
          className={`inputSelectStyle ${
            withoutLabelMargin ? "mt-0" : "mt-1"
          }`}
        >
          <SelectValue 
            placeholder={placeholder} 
            className="text-black-200" 
          />
        </SelectTrigger>

        <SelectContent className="bg-white border-none">
          {options?.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id.toString()} 
              className="focus:bg-gray-100 focus:text-black cursor-pointer hover:bg-gray-100"
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