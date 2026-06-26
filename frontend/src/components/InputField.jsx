export default function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  className = "",
}) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={`form-control ${error ? "is-invalid" : ""} ${className}`}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
