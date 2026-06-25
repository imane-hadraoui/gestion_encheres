export default function Select({
    className = "",
    style = {},
    value,
    onChange,
    options = [] ,
    name,
    error,
}) {
    return (
        <select
            className={`form-select ${error ? "is-invalid" : ""} ${className}`}
            style={{ cursor: 'pointer', ...style }}
            value={value}
            onChange={onChange}
            name={name}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}