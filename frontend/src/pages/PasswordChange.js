import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import PasswordChangeForm from '../components/forms/PasswordChangeForm';

export default function PasswordChange() {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate('/');
        }
    });

    return user.isLoggedIn && (
        <div className="form-page">
            <div className="form-container">
                <PasswordChangeForm />
            </div>
        </div>
    );
}
