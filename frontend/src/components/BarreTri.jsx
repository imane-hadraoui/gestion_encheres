import SelectGroupe from './SelectGroupe.jsx';

export function BarreTri({ total, triActuel, onChangementTri,optionsTri }) {
    return (
        <div className="d-flex justify-content-between align-items-center  border-bottom text-secondary">
           
            <div className="fw-medium ">
                {total} objets
            </div>

            {/* <div className="d-flex align-items-center gap-3 text-nowrap">
                <SelectGroupe 
                    label="Trier par"
                    className="d-flex align-items-center gap-1  text-nowrap"
                    selectClassName='form-select form-select-sm border-0 text-primary fw-medium bg-transparent'
                    value={triActuel}
                    name="filter"
                    onChange={(e) => onChangementTri(e.target.value)}
                    options={optionsTri} 
                />
            </div> */}

        </div>
    );
}