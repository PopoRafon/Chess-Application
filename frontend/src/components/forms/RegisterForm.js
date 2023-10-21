import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import getUserData from '../../utils/UserData';
import { refreshAccessToken } from '../../utils/AccessToken';
import { FormInput, FormCheckbox } from './Form';
import { useAlert } from '../../contexts/AlertContext';

export default function RegisterForm() {
    const { setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password1: '',
        password2: '',
        checkbox: false
    });
    const [errors, setErrors] = useState({});

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
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
                    localStorage.setItem('access', data.success.access);
                    getUserData(setUser);
                    refreshAccessToken();
                    setAlert({
                        show: true,
                        message: 'Your account has been successfully created!'
                    });
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
            />
            <FormInput
                id="username"
                label="Username"
                type="text"
                value={formData.username}
                handleChange={handleChange}
                error={errors.username}
            />
            <FormInput
                id="password1"
                label="Password"
                type="password"
                value={formData.password1}
                handleChange={handleChange}
                error={errors.password1}
            />
            <FormInput
                id="password2"
                label="Confirm Password"
                type="password"
                value={formData.password2}
                handleChange={handleChange}
                error={errors.password2}
            />
            <FormCheckbox
                checked={formData.checkbox}
                handleChange={handleChange}
                label="Agree to Terms of Service"
                error={errors.checkbox}
            />
            <input
                type="submit"
                value="Register"
                className="form-submit-button"
            />
        </form>
    );
}
