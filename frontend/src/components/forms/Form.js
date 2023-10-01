function FormInput({ id, label, type, value, handleChange, error }) {
    return (
        <div className="form-input-container">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                name={id}
                value={value}
                onChange={handleChange}
                autoComplete="off"
                className={error ? "invalid-form-input" : "form-input"}
            />
            {error && (<div className="invalid-field">{error}</div>)}
        </div>
    );
}

function FormCheckbox({ checked, handleChange, label, error }) {
    return (
        <div className="form-checkbox-container">
            <label>
                <input
                    type="checkbox"
                    name="checkbox"
                    checked={checked}
                    onChange={handleChange}
                />
                {label}
            </label>
            {error && (<div className="invalid-field">{error}</div>)}
        </div>
    );
}

export { FormInput, FormCheckbox };
