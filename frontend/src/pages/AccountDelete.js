import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import AccountDeleteForm from '#components/forms/AccountDeleteForm';

export default function AccountDelete() {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate('/');
        }
    });

    return user.isLoggedIn && (
        <main className="form-page">
            <div className="form-container">
                <AccountDeleteForm />
            </div>
        </main>
    );
}
