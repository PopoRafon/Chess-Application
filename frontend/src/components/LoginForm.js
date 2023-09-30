import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import getUserData from '../utils/UserData';
import { refreshAccessToken } from '../utils/AccessToken';

function LoginForm({ setAlert }) {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

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
                    localStorage.setItem('access', data.success.access);
                    getUserData(setUser);
                    refreshAccessToken();
                    setAlert({
                        show: true,
                        message: 'You have been successfuly logged in to your account!'
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
            <div className="form-input-container">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="off"
                    className={errors.username ? "invalid-form-input" : "form-input"}
                />
                {errors.username && (<div className="invalid-field">{errors.username}</div>)}
            </div>
            <div className="form-input-container">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "invalid-form-input" : "form-input"}
                />
                {errors.password && (<div className="invalid-field">{errors.password}</div>)}
            </div>
            <input
                type="submit"
                value="Login"
                className="form-submit-button"
            />
        </form>
    );
}

export default LoginForm;
