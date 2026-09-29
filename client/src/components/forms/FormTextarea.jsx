import React from "react";

export const FormTextarea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 5,
  required = false,
  error,
  hint,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={id || name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-textarea ${error ? "is-invalid" : ""}`}
      />
      {hint && !error && <div className="form-hint">{hint}</div>}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormTextarea;
