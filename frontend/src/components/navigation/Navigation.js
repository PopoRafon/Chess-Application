import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import { useAlert } from '#contexts/AlertContext';
import NavigationLink from './NavigationLink';

export default function Navigation() {
    const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
    const { user, setUser } = useUser();
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const navRef = useRef();

    function handleNavbarExpansion() {
        setIsNavbarExpanded(prev => !prev);
        navRef.current.style = isNavbarExpanded ? '' : 'transform: translateX(0px);';
    }

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
        <nav
            className="nav"
            ref={navRef}
        >
            <div className="nav-content">
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
            </div>
            <div className="nav-mobile-menu">
                <button
                    className="nav-mobile-menu-button"
                    onClick={handleNavbarExpansion}
                >
                    {isNavbarExpanded ? (
                        <img
                            width="20px"
                            src="/static/images/icons/navigation/shrink_navbar_icon.png"
                            alt="Shrink Navbar"
                        />
                    ) : (
                        <img
                            width="20px"
                            src="/static/images/icons/navigation/expand_navbar_icon.png"
                            alt="Expand Navbar"
                        />
                    )}
                </button>
            </div>
        </nav>
    );
}
