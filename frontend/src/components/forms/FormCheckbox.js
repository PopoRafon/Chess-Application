export default function FormCheckbox({ checked, handleChange, label, error }) {
    return (
        <div className="form-checkbox-container">
            <label style={{ cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    name="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                />
                {label}
            </label>
            {error && <div className="invalid-field">{error}</div>}
        </div>
    );
}
