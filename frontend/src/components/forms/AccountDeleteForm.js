import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';
import { useUser } from '../../contexts/UserContext';
import FormInput from './FormInput';

export default function AccountDeleteForm() {
    const { setAlert } = useAlert();
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ password: '' });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        const accessToken = Cookies.get('access');

        fetch('/api/v1/user/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                setUser({ isLoggedIn: false });

                setAlert(data.success);

                navigate('/');
            } else {
                setErrors(data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <form
            className="form"
            onSubmit={handleSubmit}
            noValidate={true}
        >
            <FormInput
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                handleChange={handleChange}
                error={errors.password}
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
