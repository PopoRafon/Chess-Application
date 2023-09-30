import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Navigation({ routerPaths, isLoaded }) {
    const { user, setUser } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const isPathValid = routerPaths.includes(location.pathname);

    const navLinks = [
        {
            key: 1,
            title: 'Play',
            href: '/play'
        },
        {
            key: 2,
            title: 'Ranking',
            href: '/ranking'
        },
        {
            key: 3,
            title: 'Login',
            href: '/login'
        },
        {
            key: 4,
            title: 'Sign Up',
            href: '/register'
        }
    ];

    async function handleClick() {
        await fetch('/api/v1/logout', {
            method: 'GET'
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                localStorage.removeItem('access');
                setUser({
                    isLoggedIn: false
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });

        navigate('/');
    }

    return (
        <>
            {isPathValid && isLoaded && (
                <nav className="nav">
                    <div className="nav-logo">
                        <Link to='/'>Logo Placeholder</Link>
                    </div>
                    <ul>
                        {navLinks.map((link) => (
                            user.isLoggedIn && (link.title === 'Login' || link.title === 'Sign Up') ? (
                                ''
                            ) : (
                                <li key={link.key}>
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
                                onClick={handleClick}
                                className="nav-footer-logout-button"
                            >
                            </button>
                        </div>
                    )}
                </nav>
            )}
        </>
    );
}

export default Navigation;
