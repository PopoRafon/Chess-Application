import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Cookies from 'js-cookie';

export default function Sidebar({ setMatchmaking }) {
    const navigate = useNavigate();
    const { user } = useUser();
    const socket = useRef();

    useEffect(() => {
        return () => {
            if (socket.current) {
                socket.current.close();
                socket.current = null;
            }
        }
    }, []);

    function handleMatchmaking() {
        if (user.isLoggedIn) {
            const gameUrl = Cookies.get('ranking_game_url');

            if (gameUrl) {
                navigate(`/play/online/${gameUrl}`);
            }
        } else {
            const gameToken = Cookies.get('guest_game_token');
            const gameUrl = Cookies.get('guest_game_url');

            if (gameUrl && gameToken) {
                navigate(`/play/online/${gameUrl}`);
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
        <div className="play-page-sidebar">
            <ul style={{ width: '100%' }}>
                <li>
                    <button
                        onClick={handleMatchmaking}
                        className="sidebar-play-button"
                    >
                        <span className="sidebar-play-button-title">Play Online</span>
                        <span className="sidebar-play-button-content">Play online with other players</span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleGameCreation}
                        className="sidebar-play-button"
                    >
                        <span className="sidebar-play-button-title">Computer</span>
                        <span className="sidebar-play-button-content">Play with computer</span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => navigate('/play/friend')}
                        className="sidebar-play-button"
                    >
                        <span className="sidebar-play-button-title">Play with Friend</span>
                        <span className="sidebar-play-button-content">Invite your friend to the game</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}
