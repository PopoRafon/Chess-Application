import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Navigation({ routerPaths }) {
    const { user } = useUser();
    const location = useLocation();
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
    ]

    return (
        <>
            {isPathValid && (
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
                            {user.username}
                        </div>
                    )}
                </nav>
            )}
        </>
    );
}

export default Navigation;
