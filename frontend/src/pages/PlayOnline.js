import Sidebar from '../components/sidebars/PlayOnlineSidebar';
import Game from '../components/game/Game';
import Navigation from '../components/sidebars/Navigation';
import { GameProvider } from '../contexts/GameContext';
import { useState, useEffect, useRef } from 'react';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { setupUserGame, setupGuestGame } from '../utils/GameRoom';

export default function PlayOnline({ isLoaded }) {
    const { user } = useUser();
    const navigate = useNavigate();
    const [disableBoard, setDisableBoard] = useState(false);
    const [promotionMenu, setPromotionMenu] = useState({ show: false });
    const [isSocketLoaded, setIsSocketLoaded] = useState(false);
    const gameId = window.location.pathname.split('/')[3];
    const socket = useRef();
    const users = [
        {username: 'Guest', rating: ''},
        user.isLoggedIn ? {username: user.username, rating: user.rating} : {username:'Guest', rating: ''}
    ];

    useEffect(() => {
        if (user.isLoggedIn) {
            setupUserGame(gameId, socket, navigate, setIsSocketLoaded);
        } else {
            setupGuestGame(gameId, socket, navigate, setIsSocketLoaded);
        }
    }, [navigate, gameId, user.isLoggedIn]);

    useEffect(() => {
        if (socket.current) {
            socket.current.onmessage = (message) => {
                console.log(message);
            }
        }

        return () => {
            if (socket.current) {
                socket.current.close();
                socket.current = null;
            }
        }
    }, []);

    return isLoaded && isSocketLoaded && (
        <>
            <Navigation />
            <div className="play-page">
                <GameProvider>
                    <ValidMovesProvider>
                        <Game
                            users={users}
                            disableBoard={disableBoard}
                            setDisableBoard={setDisableBoard}
                            promotionMenu={promotionMenu}
                            setPromotionMenu={setPromotionMenu}
                        />
                        <Sidebar
                            messages={[]}
                            setDisableBoard={setDisableBoard}
                            setPromotionMenu={setPromotionMenu}
                        />
                    </ValidMovesProvider>
                </GameProvider>
            </div>
        </>
    );
}
