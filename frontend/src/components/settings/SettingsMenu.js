import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUser } from '../../contexts/UserContext';
import { useAlert } from '../../contexts/AlertContext';
import getUserData from '../../utils/UserData';

export default function SettingsContainer() {
    const { user, setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [accountDeleteAlert, setAccountDeleteAlert] = useState(false)
    const [username, setUsername] = useState({ disabled: true, value: user.username });
    const [email, setEmail] = useState({ disabled: true, value: user.email });
    const [avatar, setAvatar] = useState();

    function handleAccountDelete() {
        const accessToken = Cookies.get('access');

        fetch('/api/v1/user/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                setUser({ isLoggedIn: false });

                setAlert(data.success);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function handleChange(event) {
        const { name, value, files } = event.target;

        if (name === 'username') {
            setUsername({ ...username, value: value });
        } else if (name === 'email') {
            setEmail({ ...email, value: value });
        } else if (name === 'avatar' && files && files[0]) {
            setAvatar(files[0]);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const accessToken = Cookies.get('access');
        const formData = new FormData();

        if (!email.disabled) {
            formData.append('email', email.value);
        }
        if (!username.disabled) {
            formData.append('username', username.value);
        }
        if (avatar) {
            formData.append('avatar', avatar);
        }

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

                setAlert(data.success);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function handleFieldStatusChange(setField) {
        return () => {
            setField(prev => {
                return { ...prev, disabled: !prev.disabled };
            });
        }
    }

    return (
        <form
            className="settings-container"
            onSubmit={handleSubmit}
        >
            <div className="settings-header">
                <div>Account Settings</div>
                <img
                    className="settings-avatar"
                    src={user.avatar}
                    alt="Settings Avatar"
                />
                <input
                    name="avatar"
                    type="file"
                    className="settings-avatar-input"
                    onChange={handleChange}
                />
            </div>
            <div className="settings-body">
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
                    />
                    {email.disabled ? (
                        <button
                            type="button"
                            className="settings-lock-button"
                            onClick={handleFieldStatusChange(setEmail)}
                        >
                            <img
                                className="settings-lock-image"
                                src="/static/images/icons/lock_icon.png"
                                alt="Lock Email Input"
                            />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="settings-lock-button"
                            onClick={handleFieldStatusChange(setEmail)}
                        >
                            <img
                                className="settings-lock-image"
                                src="/static/images/icons/unlock_icon.png"
                                alt="Unlock Email Input"
                            />
                        </button>
                    )}
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
                    />
                    {username.disabled ? (
                        <button
                            type="button"
                            className="settings-lock-button"
                            onClick={handleFieldStatusChange(setUsername)}
                        >
                            <img
                                className="settings-lock-image"
                                src="/static/images/icons/lock_icon.png"
                                alt="Lock Username Input"
                            />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="settings-lock-button"
                            onClick={handleFieldStatusChange(setUsername)}
                        >
                            <img
                                className="settings-lock-image"
                                src="/static/images/icons/unlock_icon.png"
                                alt="Unlock Username Input"
                            />
                        </button>
                    )}
                </label>
            </div>
            <div>
                <input
                    type="submit"
                    className="settings-submit-changes-button"
                    value="Save Changes"
                />
                <button
                    type="button"
                    className="settings-password-change-button"
                    onClick={() => navigate('/password/change')}
                >
                    Change Password
                </button>
                <button
                    type="button"
                    className="settings-delete-account-button"
                    onClick={() => setAccountDeleteAlert(prev => !prev)}
                >
                    Delete Account
                </button>
            </div>
            {accountDeleteAlert && (
                <div className="account-delete-alert">
                    <div>Are you sure you want to delete your account?</div>
                    <div className="account-delete-alert-remainder">(This action is irreversible!)</div>
                    <div className="account-delete-alert-buttons-container">
                        <button
                            type="button"
                            className="account-delete-yes-button"
                            onClick={handleAccountDelete}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className="account-delete-no-button"
                            onClick={() => setAccountDeleteAlert(false)}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
