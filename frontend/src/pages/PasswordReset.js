import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import PasswordResetForm from '../components/forms/PasswordResetForm';
import Navigation from '../components/core/Navigation';

export default function PasswordReset() {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/');
        }
    });

    return !user.isLoggedIn && (
        <>
            <Navigation />
            <div className="form-page">
                <div className="form-container">
                    <PasswordResetForm />
                </div>
            </div>
        </>
    );
}
