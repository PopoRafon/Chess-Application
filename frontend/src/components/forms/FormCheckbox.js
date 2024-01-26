export default function FormCheckbox({ checked, handleChange, label, error }) {
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
            {error && <div className="invalid-field">{error}</div>}
        </div>
    );
}
