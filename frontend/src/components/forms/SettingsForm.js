import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { emailReq, usernameReq } from '../../helpers/FormsRequirements';
import FormInput from './FormInput';

export default function SettingsForm() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: user.email,
        username: user.username
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
        console.log('submit');
    }

    function handleAccountDelete() {
        console.log('delete account');
    }

    return (
        <form
            className="form"
            onSubmit={handleSubmit}
            noValidate={true}
        >
                <div className="form-header">Account Settings</div>
                <div className="settings-body">
                    <FormInput
                        id="email"
                        label="Email Address"
                        type="text"
                        value={formData.email}
                        handleChange={handleChange}
                        error=""
                        requirements={emailReq}
                    />
                    <FormInput
                        id="username"
                        label="Username"
                        type="text"
                        value={formData.username}
                        handleChange={handleChange}
                        error=""
                        requirements={usernameReq}
                    />
                </div>
                <div className="settings-footer">
                    <input
                        type="submit"
                        className="settings-submit-changes-button"
                        value="Save Changes"
                    />
                    <button
                        className="settings-password-change-button"
                        onClick={() => navigate('/password/change')}
                    >
                        Change Password
                    </button>
                    <button
                        className="settings-delete-account-button"
                        onClick={handleAccountDelete}
                    >
                        Delete Account
                    </button>
                </div>
        </form>
    );
}
