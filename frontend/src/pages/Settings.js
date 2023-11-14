import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Navigation from '../components/core/Navigation';
import SettingsForm from '../components/forms/SettingsForm';

export default function Settings() {
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
                    <SettingsForm />
                </div>
            </div>
        </>
    );
}
