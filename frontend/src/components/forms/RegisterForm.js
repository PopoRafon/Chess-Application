import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { refreshAccessToken } from '../../utils/AccessToken';
import { useAlert } from '../../contexts/AlertContext';
import { emailReq, usernameReq, passwordReq, confirmPasswordReq } from '../../helpers/FormsRequirements';
import FormInput from './FormInput';
import FormCheckbox from './FormCheckbox';
import getUserData from '../../utils/UserData';

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

    function validation() {
        const { email, username, password1, password2, checkbox } = formData;
        const newErrors = {};

        if (!email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)) newErrors['email'] = 'Enter a valid email address.';

        if (email.length < 8) newErrors['email'] = 'Ensure this field has at least 8 characters.';

        if (email.length > 64) newErrors['email'] = 'Ensure this field has no more than 64 characters.';

        if (username.length < 8) newErrors['username'] = 'Ensure this field has at least 8 characters.';

        if (username.length > 16) newErrors['username'] = 'Ensure this field has no more than 16 characters.';

        if (password1.length < 8) newErrors['password1'] = 'Ensure this field has at least 8 characters.';

        if (password1 !== password2) newErrors['password2'] = 'Passwords must be the same.';

        if (password2.length < 8) newErrors['password2'] = 'Ensure this field has at least 8 characters.';

        if (!checkbox) newErrors['checkbox'] = 'Terms of Service must be accepted.';

        if (Object.keys(newErrors).length >= 1) {
            setErrors(newErrors);
            return false;
        }

        return true;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (validation()) {
            fetch('/api/v1/register', {
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
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                handleChange={handleChange}
                error={errors.email}
                requirements={emailReq}
            />
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
                id="password1"
                label="Password"
                type="password"
                value={formData.password1}
                handleChange={handleChange}
                error={errors.password1}
                requirements={passwordReq}
            />
            <FormInput
                id="password2"
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
