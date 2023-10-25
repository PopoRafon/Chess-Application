import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useAlert } from '../../contexts/AlertContext';

export default function Navigation() {
    const { user, setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();

    const navLinks = [
        {
            title: 'Play',
            href: '/play'
        },
        {
            title: 'Ranking',
            href: '/ranking'
        },
        {
            title: 'Login',
            href: '/login'
        },
        {
            title: 'Sign Up',
            href: '/register'
        }
    ];

    async function handleLogout() {
        await fetch('/api/v1/logout', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setUser({ isLoggedIn: false });

                setAlert('You have been successfully logged out of your account!');
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
                <Link to='/'>Logo Placeholder</Link>
            </div>
            <ul>
                {navLinks.map((link, index) => (
                    (user.isLoggedIn && (link.title === 'Login' || link.title === 'Sign Up')) || (
                        <li key={index}>
                            <Link
                                to={link.href}
                                className="nav-link"
                            >
                                {link.title}
                            </Link>
                        </li>
                    )
                ))}
            </ul>
            {user.isLoggedIn && (
                <div className="nav-footer">
                    <div className="nav-footer-user">
                        <img
                            src='/static/images/avatar.png'
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
