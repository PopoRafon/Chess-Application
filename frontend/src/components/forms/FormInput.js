import { useState } from 'react';

export default function FormInput({ id, label, type, value, handleChange, error, requirements }) {
    const [requirementsTooltip, setRequirementsTooltip] = useState(false);

    return (
        <div className="form-input-container">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                name={id}
                value={value}
                onChange={handleChange}
                onFocus={() => setRequirementsTooltip(true)}
                onBlur={() => setRequirementsTooltip(false)}
                autoComplete="off"
                className={error ? "invalid-form-input" : "form-input"}
            />
            {requirements && requirementsTooltip && (
                <ul className="form-input-tooltip">
                    {requirements.map((req, index) => (
                        <li
                            className=""
                            key={index}
                        >
                            • {req}
                        </li>
                    ))}
                </ul>
            )}
            {error && <div className="invalid-field">{error}</div>}
        </div>
    );
}
