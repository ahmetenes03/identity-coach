function Input({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) {
  return (
    <div className="input-group">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? "input-error" : ""}
      />

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default Input;