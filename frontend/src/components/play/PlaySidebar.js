import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import Cookies from 'js-cookie';
import RecentGames from './RecentGames';

export default function Sidebar({ matchmaking, setMatchmaking }) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();
    const socket = useRef();

    useEffect(() => {
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        }
    }, []);

    useEffect(() => {
        if (!matchmaking && socket.current) {
            socket.current.close();
            socket.current = null;
        }
    }, [matchmaking]);

    function handleMatchmaking() {
        if (user.isLoggedIn) {
            const gameUrl = Cookies.get('ranking_game_url');

            if (gameUrl) {
                return navigate(`/play/online/${gameUrl}`);
            }
        } else {
            const gameToken = Cookies.get('guest_game_token');
            const gameUrl = Cookies.get('guest_game_url');

            if (gameUrl && gameToken) {
                return navigate(`/play/online/${gameUrl}`);
            }
        }

        if (!socket.current) {
            socket.current = new WebSocket(`ws://${window.location.hostname}:8000/ws/matchmaking/`);

            setMatchmaking(true);

            socket.current.onmessage = (message) => {
                const data = JSON.parse(message.data);
                const { url, guest_game_token } = data;

                if (url) {
                    if (user.isLoggedIn) {
                        Cookies.set('ranking_game_url', url);
                    } else {
                        Cookies.set('guest_game_token', guest_game_token);
                        Cookies.set('guest_game_url', url);
                    }

                    navigate(`/play/online/${url}`);
                }
            }
        }
    }

    function handleGameCreation() {
        const gameToken = Cookies.get('computer_game_token');
        const gameUrl = Cookies.get('computer_game_url');

        if (gameToken && gameUrl) {
            navigate('/play/computer/');
        } else {
            fetch('/api/v1/computer/game/room', {
                method: 'POST'
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    Cookies.set('computer_game_token', data.player);
                    Cookies.set('computer_game_url', data.id);
                    navigate('/play/computer');
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    return (
        <aside
            className="play-sidebar"
            style={{ transform: isSidebarExpanded ? 'translateX(0px)' : '' }}
        >
            <div className="play-sidebar-mobile-menu">
                <button
                    className="play-sidebar-mobile-menu-button"
                    onClick={() => setIsSidebarExpanded(prev => !prev)}
                >    
                    {isSidebarExpanded ? (
                        <img
                            width="20px"
                            src="/static/images/icons/right_arrow_icon.png"
                            alt="Shrink Sidebar"
                        />
                    ) : (
                        <img
                            width="20px"
                            src="/static/images/icons/left_arrow_icon.png"
                            alt="Expand Sidebar"
                        />
                    )}
                </button>
            </div>
            <div className="play-sidebar-content">
                <div className="play-sidebar-account-information">
                    <div className="account-statistics">
                        <h2 className="account-statistics-header">Account Statistics</h2>
                        <div className="account-statistics-body">
                            <div style={{ color: 'green' }}>Wins: {user.wins}</div>
                            <div style={{ color: 'red' }}>Loses: {user.loses}</div>
                            <div style={{ color: 'grey' }}>Draws: {user.draws}</div>
                            <div>Rating: {user.rating}</div>
                        </div>
                    </div>
                    <RecentGames />
                </div>
                <div className="play-sidebar-buttons-container">
                    <button
                        onClick={handleMatchmaking}
                        className="play-sidebar-button"
                    >
                        <span className="play-sidebar-button-title">Play Online</span>
                        <span className="play-sidebar-button-content">Play online with other players</span>
                    </button>
                    <button
                        onClick={handleGameCreation}
                        className="play-sidebar-button"
                    >
                        <span className="play-sidebar-button-title">Computer</span>
                        <span className="play-sidebar-button-content">Play with computer</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
