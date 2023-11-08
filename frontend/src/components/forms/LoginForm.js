import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { refreshAccessToken } from '../../utils/AccessToken';
import { useAlert } from '../../contexts/AlertContext';
import { usernameReq, passwordReq } from '../../helpers/FormsRequirements';
import FormInput from './FormInput';
import getUserData from '../../utils/UserData';

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

    function validation() {
        const { username, password } = formData;
        const newErrors = {};

        if (username.length < 8) newErrors['username'] = 'Ensure this field has at least 8 characters.';

        if (username.length > 16) newErrors['username'] = 'Ensure this field has no more than 16 characters.';

        if (password.length < 8) newErrors['password'] = 'Ensure this field has at least 8 characters.';

        if (Object.keys(newErrors).length >= 1) {
            setErrors(newErrors);
            return false;
        }

        return true;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (validation()) {
            fetch('/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    getUserData(setUser);

                    refreshAccessToken();

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
                id="username"
                label="Username"
                type="text"
                value={formData.username}
                handleChange={handleChange}
                error={errors.username}
                requirements={usernameReq}
            />
            <FormInput
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                handleChange={handleChange}
                error={errors.password}
                requirements={passwordReq}
            />
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
