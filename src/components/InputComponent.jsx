import { Input } from "../components/ui/input";

export function InputComponent({
  id,
  label,
  icon,
  className,
  inputClassName,
  value,
  onChange,
  ...props
}) {
  return (
    <div className={`${className || ""}`}>
      {label && (
        <label htmlFor={id} className="text-text4Medium text-black-400">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <img src={icon} alt="icon" width={18} height={18} />
          </div>
        )}
        <Input
          id={id}
          className={`inputSelectStyle focus:outline-none placeholder-black ${
            icon ? "pl-8" : "px-3"
          } ${inputClassName || ""}`}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          {...props}
        />
      </div>
    </div>
  );
}