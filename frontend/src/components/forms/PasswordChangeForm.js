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
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    function validation() {
        const { oldPassword, newPassword1, newPassword2 } = formData;
        const newErrors = {};

        if (oldPassword.length < 8) newErrors['oldPassword'] = 'Ensure this field contains correct old password.';

        if (newPassword1.length < 8) newErrors['newPassword1'] = 'Ensure this field has at least 8 characters.';

        if (newPassword1 !== newPassword2) newErrors['newPassword2'] = 'Passwords must be the same.';

        if (newPassword2.length < 8) newErrors['newPassword2'] = 'Ensure this field has at least 8 characters.';

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
            <FormInput
                id="oldPassword"
                label="Old Password"
                type="password"
                value={formData.oldPassword}
                handleChange={handleChange}
                error={errors.oldPassword}
                requirements={oldPasswordReq}
            />
            <FormInput
                id="newPassword1"
                label="New Password"
                type="password"
                value={formData.newPassword1}
                handleChange={handleChange}
                error={errors.newPassword1}
                requirements={passwordReq}
            />
            <FormInput
                id="newPassword2"
                label="Confirm New Password"
                type="password"
                value={formData.newPassword2}
                handleChange={handleChange}
                error={errors.newPassword2}
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
