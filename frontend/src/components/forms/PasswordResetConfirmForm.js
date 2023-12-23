import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordReq, confirmPasswordReq } from '../../helpers/FormsRequirements';
import { passwordResetConfirmFormValidation } from '../../helpers/FormsValidations';
import { useAlert } from '../../contexts/AlertContext';
import FormInput from './FormInput';

export default function PasswordResetConfirmForm() {
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        new_password1: '',
        new_password2: '',
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        const path = window.location.pathname.split('/');

        if (passwordResetConfirmFormValidation(formData, setErrors)) {
            fetch(`/api/v1/password/reset/confirm/${path[4]}/${path[5]}`, {
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

                    navigate('/login');
                } else if (data.token || data.error) {
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
                id="new_password1"
                label="New Password"
                type="password"
                value={formData.new_password1}
                handleChange={handleChange}
                error={errors.new_password1}
                requirements={passwordReq}
            />
            <FormInput
                id="new_password2"
                label="Confirm New Password"
                type="password"
                value={formData.new_password2}
                handleChange={handleChange}
                error={errors.new_password2}
                requirements={confirmPasswordReq}
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
