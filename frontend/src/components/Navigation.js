import { Link } from 'react-router-dom';

function Navigation() {
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
        <nav className="nav">
            <div className="nav-logo">
                <Link to='/'>Logo Placeholder</Link>
            </div>
            <ul>
                {navLinks.map((link) => (
                    <li>
                        <Link to={link.href} className="nav-link" key={link.key}>{link.title}</Link>
                    </li>
                ))}
            </ul>
            <div className="nav-footer" key="nav-username">
                Username Placeholder
            </div>
        </nav>
    );
}

export default Navigation;
