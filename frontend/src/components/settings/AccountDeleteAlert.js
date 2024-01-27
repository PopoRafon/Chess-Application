import { useNavigate } from 'react-router-dom';

export default function AccountDeleteAlert({ setAccountDeleteAlert }) {
    const navigate = useNavigate();

    return (
        <div className="account-delete-alert">
            <div>Are you sure you want to delete your account?</div>
            <div className="account-delete-alert-remainder">(This action is irreversible!)</div>
            <div className="account-delete-alert-buttons-container">
                <button
                    type="button"
                    className="account-delete-button account-delete-red-button"
                    onClick={() => navigate('/account/delete')}
                >
                    Yes
                </button>
                <button
                    type="button"
                    className="account-delete-button account-delete-green-button"
                    onClick={() => setAccountDeleteAlert(false)}
                >
                    No
                </button>
            </div>
        </div>
    );
}
