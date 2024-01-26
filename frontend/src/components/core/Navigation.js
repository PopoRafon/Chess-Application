import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import { useAlert } from '#contexts/AlertContext';
import NavigationLink from './NavigationLink';

export default function Navigation() {
    const { user, setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();

    function handleLogout() {
        fetch('/api/v1/logout', {
            method: 'POST'
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setUser({ isLoggedIn: false });

                setAlert(data.success);

                navigate('/');
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <nav className="nav">
            <Link
                to='/'
                className="nav-logo"
            >
                <img
                    src="/static/images/logo.svg"
                    className="nav-logo-icon"
                    alt="Logo"
                />
            </Link>
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
