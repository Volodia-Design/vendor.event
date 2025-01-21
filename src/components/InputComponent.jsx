import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";

export function InputComponent({
  id,
  label,
  icon,
  className,
  inputClassName,
  value,
  onChange,
  type,
  isPrice = false,
  ...props
}) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isPrice) {
      const stringValue = String(value || '');
      setDisplayValue(isFocused ? stringValue.replace('$', '') : stringValue ? `${stringValue}$` : '');
    } else {
      setDisplayValue(String(value || ''));
    }
  }, [value, isFocused, isPrice]);

  const handleFocus = () => {
    setIsFocused(true);
    if (isPrice && displayValue) {
      setDisplayValue(displayValue.replace('$', ''));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isPrice && displayValue) {
      const cleanValue = displayValue.replace('$', '');
      setDisplayValue(cleanValue ? `${cleanValue}$` : '');
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (isPrice) {
      const digitsOnly = newValue.replace(/[^\d]/g, '');
      onChange?.(digitsOnly.toString());
    } else {
      onChange?.(newValue.toString());
    }
  };

  return (
    <div className={`${className || ""}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-text4Medium text-black-400 flex items-center"
        >
          {typeof label === "string" ? label : label}
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
          className={`mt-1 inputSelectStyle focus:outline-none placeholder-black ${
            icon ? "pl-8" : "px-3"
          } ${inputClassName || ""}`}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={isPrice ? "text" : type}
          {...props}
        />
      </div>
    </div>
  );
}