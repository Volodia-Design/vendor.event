import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

// Custom Select Component
export function SelectComponent({
  id,
  label,
  value,
  onChange,
  options,
  className,
  placeholder,
}) {
  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className={`text-text4Medium text-white`}>
          {label}
        </label>
      )}

      <Select
        id={id}
        value={value}
        onValueChange={onChange}
        className="rounded-lg bg-white"
      >
        <SelectTrigger
          className={`inputSelectStyle`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="bg-white border-none">
          {options?.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id}
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
