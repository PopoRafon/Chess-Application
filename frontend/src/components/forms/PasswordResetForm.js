import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '#contexts/AlertContext';
import { emailRecoveryReq } from '#helpers/FormsRequirements';
import { passwordResetFormValidation } from '#helpers/FormsValidations';
import FormInput from './FormInput';

export default function PasswordResetForm() {
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ email: '' });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (passwordResetFormValidation(formData, setErrors)) {
            fetch('/api/v1/password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    setAlert(data.success);

                    navigate('/');
                } else {
                    setErrors(data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    return (
        <form
            className="form"
            onSubmit={handleSubmit}
            noValidate={true}
        >
            <FormInput
                name="email"
                label="Email address"
                type="text"
                value={formData.email}
                handleChange={handleChange}
                error={errors.email}
                requirements={emailRecoveryReq}
            />
            <div className="form-buttons" style={{ justifyContent: 'center' }}>
                <input
                    type="submit"
                    value="Submit"
                    className="form-submit-button"
                />
            </div>
        </form>
    );
}
