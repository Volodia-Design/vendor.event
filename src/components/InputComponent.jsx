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
  error,
  placeholderColorGray,
  isPhoneNumber,
  onlyDigits = false,
  ...props
}) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (isPrice) {
      const stringValue = String(value || '');
      setDisplayValue(isFocused ? stringValue.replace('$', '') : stringValue ? `${stringValue}$` : '');
    } else if (isPhoneNumber) {
      const stringValue = String(value || '');
      const digitsOnly = stringValue.replace(/\D/g, '');
      setDisplayValue(digitsOnly ? `+${digitsOnly}` : '');
    } else if(onlyDigits){
      const stringValue = String(value || '');
      const digitsOnly = stringValue.replace(/\D/g, '');
      setDisplayValue(digitsOnly);
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
          className={`mt-1 inputSelectStyle focus:outline-none  ${
            icon ? "pl-8" : "px-3"
          } ${inputClassName || ""} ${placeholderColorGray ? "placeholder-gray" : "placeholder-black"}`}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type === "password" && isPasswordVisible ? "text" : type}
          {...props}
        />
        {type === "password" && (
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
           {isPasswordVisible ? (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-[#cfac28] hover:text-[#cfac28]/80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
) : (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-[#cfac28] hover:text-[#cfac28]/80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.97 10.97 0 0112 19c-7 0-11-7-11-7a21.82 21.82 0 013.05-4.2"></path>
    <path d="M1 1l22 22"></path>
  </svg>
)}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-text4Medium">{error}</p>
      )}
    </div>
  );
}
