import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import { useAlert } from '#contexts/AlertContext';
import { emailReq, usernameReq, passwordReq, confirmPasswordReq } from '#helpers/FormsRequirements';
import { registerFormValidation } from '#helpers/FormsValidations';
import AccessToken from '#utils/AccessToken';
import FormInput from './FormInput';
import FormCheckbox from './FormCheckbox';
import getUserData from '#utils/UserData';

export default function RegisterForm() {
    const { setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password1: '',
        password2: '',
        checkbox: false
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

        if (registerFormValidation(formData, setErrors)) {
            fetch('/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    getUserData(setUser);

                    AccessToken.refreshToken();

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
                label="Email Address"
                type="email"
                value={formData.email}
                handleChange={handleChange}
                error={errors.email}
                requirements={emailReq}
            />
            <FormInput
                name="username"
                label="Username"
                type="text"
                value={formData.username}
                handleChange={handleChange}
                error={errors.username}
                requirements={usernameReq}
            />
            <FormInput
                name="password1"
                label="Password"
                type="password"
                value={formData.password1}
                handleChange={handleChange}
                error={errors.password1}
                requirements={passwordReq}
            />
            <FormInput
                name="password2"
                label="Confirm Password"
                type="password"
                value={formData.password2}
                handleChange={handleChange}
                error={errors.password2}
                requirements={confirmPasswordReq}
            />
            <FormCheckbox
                checked={formData.checkbox}
                handleChange={(event) => setFormData({ ...formData, checkbox: event.target.checked })}
                label="Agree to Terms of Service"
                error={errors.checkbox}
            />
            <div className="form-buttons">
                <Link
                    to="/login"
                    className="form-link-button"
                >
                    Sign In
                </Link>
                <input
                    type="submit"
                    value="Register"
                    className="form-submit-button"
                />
            </div>
        </form>
    );
}
