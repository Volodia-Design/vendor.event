import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from 'prop-types';

export default function Input({
  label,
  type,
  name,
  value,
  onChange,
  showPasswordToggle = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-text2Medium mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-neutral-200 rounded-lg text-text2 focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showPasswordToggle: PropTypes.bool
};