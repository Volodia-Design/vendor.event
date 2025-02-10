export function TextareaComponent({
  id,
  label,
  icon,
  className,
  textareaClassName,
  value,
  onChange,
  error,
  isHTML = false,
  ...props
}) {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
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
        <textarea
          id={id}
          className={`p-3 mt-1 w-full inputSelectStyle focus:outline-none placeholder-gray`}
          value={value}
          onChange={handleChange}
          {...props}
        />
       
      </div>
      {error && <p className="text-red-500 text-text4Medium">{error}</p>}
    </div>
  );
}
