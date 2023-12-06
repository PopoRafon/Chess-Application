import Cookies from 'js-cookie';
import { useUser } from '../../contexts/UserContext';
import { useAlert } from '../../contexts/AlertContext';

export default function SettingsAlert({ setAccountDeleteAlert }) {
    const { setUser } = useUser();
    const { setAlert } = useAlert();

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

    return (
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
    );
}
