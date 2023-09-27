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
                    navigate('/');
                } else {
                    setErrors(data);
                }
            });
        }
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
                    className={errors.email ? "register-invalid-form-input" : "register-form-input"}
                />
                {errors.email && (<div className="invalid-field">{errors.email}</div>)}
            </div>
            <div className="register-form-input-container">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? "register-invalid-form-input" : "register-form-input"}
                />
                {errors.username && (<div className="invalid-field">{errors.username}</div>)}
            </div>
            <div className="register-form-input-container">
                <label>Password</label>
                <input
                    type="password"
                    name="password1"
                    value={formData.password1}
                    onChange={handleChange}
                    className={errors.password1 ? "register-invalid-form-input" : "register-form-input"}
                />
                {errors.password1 && (<div className="invalid-field">{errors.password1}</div>)}
            </div>
            <div className="register-form-input-container">
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className={errors.password2 ? "register-invalid-form-input" : "register-form-input"}
                />
                {errors.password2 && (<div className="invalid-field">{errors.password2}</div>)}
            </div>
            <div className="register-form-checkbox-container">
                <label>
                    <input
                        type="checkbox"
                        name="checkbox"
                        checked={formData.checkbox}
                        onChange={handleChange}
                    />
                    Agree to Terms of Service
                </label>
                {errors.checkbox && (<div className="invalid-field">{errors.checkbox}</div>)}
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
