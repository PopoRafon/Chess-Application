import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password1: '',
        password2: '',
        checkbox: false
    });
    
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

    function handleSubmit(event) {
        event.preventDefault();

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
                navigate('/');
            } else {
                console.log(data);
            }
        });
    }

    return (
        <form
            className="register-form"
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="register-form-input-container">
                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="register-form-input"
                />
            </div>
            <div className="register-form-input-container">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="register-form-input"
                />
            </div>
            <div className="register-form-input-container">
                <label>Password</label>
                <input
                    type="password"
                    name="password1"
                    value={formData.password1}
                    onChange={handleChange}
                    className="register-form-input"
                />
            </div>
            <div className="register-form-input-container">
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className="register-form-input"
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="checkbox"
                        checked={formData.checkbox}
                        onChange={handleChange}
                    />
                    Agree to Terms of Service
                </label>
            </div>
            <input
                type="submit"
                value="Register"
                className="register-form-submit-button"
            />
        </form>
    );
}

export default RegisterForm;
