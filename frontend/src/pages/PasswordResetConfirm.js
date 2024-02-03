import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import PasswordResetConfirmForm from '#components/forms/PasswordResetConfirmForm';

export default function PasswordResetConfirm() {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/');
        }
    });

    return !user.isLoggedIn && (
        <main className="form-page">
            <div className="form-container">
                <PasswordResetConfirmForm />
            </div>
        </main>
    );
}
