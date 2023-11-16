import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUser } from '../../contexts/UserContext';
import { refreshAccessToken } from '../../utils/AccessToken';
import { useAlert } from '../../contexts/AlertContext';
import { oldPasswordReq, passwordReq, confirmPasswordReq } from '../../helpers/FormsRequirements';
import FormInput from './FormInput';
import getUserData from '../../utils/UserData';

export default function PasswordChangeForm() {
    const { setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        old_password: '',
        new_password1: '',
        new_password2: '',
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    function validation() {
        const { old_password, new_password1, new_password2 } = formData;
        const newErrors = {};

        if (old_password.length < 8) newErrors['old_password'] = 'Ensure this field contains correct old password.';

        if (new_password1.length < 8) newErrors['new_password1'] = 'Ensure this field has at least 8 characters.';

        if (new_password1 !== new_password2) newErrors['new_password2'] = 'Passwords must be the same.';

        if (new_password2.length < 8) newErrors['new_password2'] = 'Ensure this field has at least 8 characters.';

        if (Object.keys(newErrors).length >= 1) {
            setErrors(newErrors);
            return false;
        }

        return true;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const accessToken = Cookies.get('access');

        if (validation()) {
            fetch('/api/v1/password/change', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
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
            <div className="form-header">Change Password</div>
            <FormInput
                id="old_password"
                label="Old Password"
                type="password"
                value={formData.old_password}
                handleChange={handleChange}
                error={errors.old_password}
                requirements={oldPasswordReq}
            />
            <FormInput
                id="new_password1"
                label="New Password"
                type="password"
                value={formData.new_password1}
                handleChange={handleChange}
                error={errors.new_password1}
                requirements={passwordReq}
            />
            <FormInput
                id="new_password2"
                label="Confirm New Password"
                type="password"
                value={formData.new_password2}
                handleChange={handleChange}
                error={errors.new_password2}
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
