import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import PasswordChangeForm from '../components/forms/PasswordChangeForm';
import Navigation from '../components/core/Navigation';

export default function PasswordChange() {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate('/');
        }
    });

    return user.isLoggedIn && (
        <>
            <Navigation />
            <div className="form-page">
                <div className="form-container">
                    <PasswordChangeForm />
                </div>
            </div>
        </>
    );
}
