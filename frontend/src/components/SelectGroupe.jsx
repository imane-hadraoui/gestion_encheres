import Select from './Select.jsx';

export default function SelectGroupe({ 
    label,                  
    className = "",        
    selectClassName = "",  
    value, 
    onChange, 
    options = [], 
    name
}) {
    return (
        <div className={`${className}`}>
            <label className="form-label mb-1">{label}</label>
            <Select 
                className={`${selectClassName}`}
                value={value}
                onChange={onChange}
                options={options}
                name={name}
            />
        </div>
    );
}