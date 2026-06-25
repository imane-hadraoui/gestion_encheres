export default function TextareaInput ({label,value,onChange}) {
    return <>
        <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">{label}</label>
            <textarea value={value} onChange={onChange} className="form-control" />
        </div>
    </>
}