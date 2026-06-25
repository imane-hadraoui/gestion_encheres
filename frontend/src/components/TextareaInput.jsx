export default function TextareaInput({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    rows = 4,
}) {
    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`form-control ${error ? "is-invalid" : ""}`}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}