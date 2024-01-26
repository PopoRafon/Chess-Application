import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import { useAlert } from '#contexts/AlertContext';
import { usernameReq, passwordReq } from '#helpers/FormsRequirements';
import { loginFormValidation } from '#helpers/FormsValidations';
import AccessToken from '#utils/AccessToken';
import FormInput from './FormInput';
import getUserData from '#utils/UserData';

export default function LoginForm() {
    const { setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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

        if (loginFormValidation(formData, setErrors)) {
            fetch('/api/v1/login', {
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
                name="username"
                label="Username"
                type="text"
                value={formData.username}
                handleChange={handleChange}
                error={errors.username}
                requirements={usernameReq}
            />
            <FormInput
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                handleChange={handleChange}
                error={errors.password}
                requirements={passwordReq}
            />
            <Link
                to='/password/reset'
                className="form-link-button"
                style={{ fontSize: 'small' }}
            >
                Account Recovery
            </Link>
            <div className="form-buttons">
                <Link
                    to="/register"
                    className="form-link-button"
                >
                    Sign Up
                </Link>
                <input
                    type="submit"
                    value="Login"
                    className="form-submit-button"
                />
            </div>
        </form>
    );
}
