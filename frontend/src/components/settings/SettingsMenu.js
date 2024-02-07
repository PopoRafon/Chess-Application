import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import { useAlert } from '#contexts/AlertContext';
import getUserData from '#utils/UserData';
import AccountDeleteAlert from './AccountDeleteAlert';

export default function SettingsContainer() {
    const { user, setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [accountDeleteAlert, setAccountDeleteAlert] = useState(false);
    const [username, setUsername] = useState({ disabled: true, value: user.username });
    const [email, setEmail] = useState({ disabled: true, value: user.email });
    const [avatar, setAvatar] = useState();

    function handleChange(event) {
        const { name, value, files } = event.target;

        if (name === 'username') setUsername({ ...username, value: value });
        else if (name === 'email') setEmail({ ...email, value: value });
        else if (name === 'avatar' && files && files[0]) setAvatar(files[0]);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const accessToken = Cookies.get('access');
        const formData = new FormData();

        if (!email.disabled) formData.append('email', email.value);
        if (!username.disabled) formData.append('username', username.value);
        if (avatar) formData.append('avatar', avatar);

        fetch('/api/v1/user/update', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: formData
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                getUserData(setUser);

                setEmail({ ...email, disabled: true });
                setUsername({ ...username, disabled: true });
                setAvatar(null);

                setAlert(data.success);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function handleFieldStatusChange(setField, initialValue) {
        return () => {
            setField(prev => ({
                value: initialValue,
                disabled: !prev.disabled
            }));
        }
    }

    return (
        <form
            className="settings-container"
            onSubmit={handleSubmit}
        >
            <div className="settings-header">Account Settings</div>
            <div className="settings-body">
                <div className="settings-input-label">
                    <img
                        className="settings-avatar"
                        src={user.avatar}
                        alt="Settings Avatar"
                    />
                    <div className="settings-avatar-input-container">
                        <input
                            name="avatar"
                            type="file"
                            className="settings-avatar-input"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="settings-input-label">
                    <div>Rating</div>
                    <div>{user.rating}</div>
                </div>
                <label
                    htmlFor="email"
                    className="settings-input-label"
                >
                    Email Address
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={email.value}
                        onChange={handleChange}
                        className="settings-input-field"
                        disabled={email.disabled}
                        autoComplete="off"
                    />
                    <button
                        type="button"
                        className="settings-lock-button"
                        onClick={handleFieldStatusChange(setEmail, user.email)}
                    >
                        <img
                            className="settings-lock-image"
                            src={`/static/images/icons/${email.disabled ? 'lock_icon' : 'unlock_icon'}.png`}
                            alt="Email Input Lock"
                        />
                    </button>
                </label>
                <label
                    htmlFor="username"
                    className="settings-input-label"
                >
                    Username
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username.value}
                        onChange={handleChange}
                        className="settings-input-field"
                        disabled={username.disabled}
                        autoComplete="off"
                    />
                    <button
                        type="button"
                        className="settings-lock-button"
                        onClick={handleFieldStatusChange(setUsername, user.username)}
                    >
                        <img
                            className="settings-lock-image"
                            src={`/static/images/icons/${username.disabled ? 'lock_icon' : 'unlock_icon'}.png`}
                            alt="Username Input Lock"
                        />
                    </button>
                </label>
            </div>
            <div className="settings-buttons-container">
                <button
                    type="submit"
                    className="settings-button settings-green-button"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    className="settings-button settings-blue-button"
                    onClick={() => navigate('/password/change')}
                >
                    Change Password
                </button>
                <button
                    type="button"
                    className="settings-button settings-red-button"
                    onClick={() => setAccountDeleteAlert(prev => !prev)}
                >
                    Delete Account
                </button>
            </div>
            {accountDeleteAlert && (
                <AccountDeleteAlert
                    setAccountDeleteAlert={setAccountDeleteAlert}
                />
            )}
        </form>
    );
}
