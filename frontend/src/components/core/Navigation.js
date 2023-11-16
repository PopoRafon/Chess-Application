import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useAlert } from '../../contexts/AlertContext';
import NavigationLink from './NavigationLink';

export default function Navigation() {
    const { user, setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();

    async function handleLogout() {
        await fetch('/api/v1/logout', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setUser({ isLoggedIn: false });

                setAlert(data.success);
            }
        })
        .catch((err) => {
            console.log(err);
        });

        navigate('/');
    }

    return (
        <nav className="nav">
            <div className="nav-logo">
                <Link to='/'>Logo placeholder</Link>
            </div>
            <ul>
                <NavigationLink
                    title="Play"
                    href="/play"
                    imagePrefix="play"
                />
                <NavigationLink
                    title="Ranking"
                    href="/ranking"
                    imagePrefix="ranking"
                />
                {user.isLoggedIn ? (
                    <NavigationLink
                        title="Settings"
                        href="/settings"
                        imagePrefix="settings"
                    />
                ) : (
                    <>
                        <NavigationLink
                            title="Login"
                            href="/login"
                            imagePrefix="login"
                        />
                        <NavigationLink
                            title="Sign Up"
                            href="/register"
                            imagePrefix="register"
                        />
                    </>
                )}
            </ul>
            {user.isLoggedIn && (
                <div className="nav-footer">
                    <div className="nav-footer-user">
                        <img
                            src={user.avatar}
                            className="nav-footer-avatar"
                            alt="Avatar"
                        />
                        <span className="nav-footer-username">{user.username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="nav-footer-logout-button"
                    >
                    </button>
                </div>
            )}
        </nav>
    );
}
