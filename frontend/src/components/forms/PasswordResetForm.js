import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordReq, confirmPasswordReq } from '../../helpers/FormsRequirements';
import FormInput from './FormInput';

export default function PasswordResetForm() {
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

    function validation() {
        const { new_password1, new_password2 } = formData;
        const newErrors = {};

        if (new_password1.length < 8) newErrors['new_password1'] = 'Ensure this field has at least 8 characters.';

        if (new_password1 !== new_password2) newErrors['new_password2'] = 'Passwords must be the same.';

        if (new_password2.length < 8) newErrors['new_password2'] = 'Ensure this field has at least 8 characters.';

        if (Object.keys(newErrors).length >= 1) {
            setErrors(newErrors);
            return false;
        }

        return true;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const path = window.location.pathname.split('/');

        if (validation()) {
            fetch(`/api/v1/password/reset/${path[3]}/${path[4]}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    navigate('/login');
                } else {
                    if (data.token || data.error) {
                        navigate('/');
                    } else {
                        setErrors(data);
                    }
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
            <div className="form-header">Create New Password</div>
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
