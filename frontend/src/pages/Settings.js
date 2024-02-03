import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import SettingsMenu from '#components/settings/SettingsMenu';

export default function Settings() {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate('/');
        }
    });

    return user.isLoggedIn && (
        <main className="settings-page">
            <SettingsMenu />
        </main>
    );
}
