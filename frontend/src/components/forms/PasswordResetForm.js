import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordReq, confirmPasswordReq } from '../../helpers/FormsRequirements';
import FormInput from './FormInput';

export default function PasswordResetForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        newPassword1: '',
        newPassword2: '',
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    function validation() {
        const { newPassword1, newPassword2 } = formData;
        const newErrors = {};

        if (newPassword1.length < 8) newErrors['newPassword1'] = 'Ensure this field has at least 8 characters.';

        if (newPassword1 !== newPassword2) newErrors['newPassword2'] = 'Passwords must be the same.';

        if (newPassword2.length < 8) newErrors['newPassword2'] = 'Ensure this field has at least 8 characters.';

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
                    if (data.token || data.user) {
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
            <FormInput
                id="newPassword1"
                label="New Password"
                type="password"
                value={formData.newPassword1}
                handleChange={handleChange}
                error={errors.newPassword1}
                requirements={passwordReq}
            />
            <FormInput
                id="newPassword2"
                label="Confirm New Password"
                type="password"
                value={formData.newPassword2}
                handleChange={handleChange}
                error={errors.newPassword2}
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
