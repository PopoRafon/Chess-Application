import { useState } from 'react';
import { UsersProvider } from '../contexts/UsersContext';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { setupRankingGame, setupGuestGame } from '../utils/GameRoom';
import { useUser } from '../contexts/UserContext';
import PrevMoves from '../components/game/sidebar/PrevMoves';
import Chat from '../components/game/sidebar/Chat';
import Game from '../components/game/board/Game';
import Navigation from '../components/core/Navigation';

export default function PlayOnline({ isLoaded }) {
    const [disableBoard, setDisableBoard] = useState(false);
    const [promotionMenu, setPromotionMenu] = useState({ show: false });
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState();
    const { user } = useUser();

    return isLoaded && (
        <>
            <Navigation />
            <div className="play-page">
                <GameProvider>
                    <ValidMovesProvider>
                        <UsersProvider>
                            <Game
                                socket={socket}
                                setSocket={setSocket}
                                gameSetup={user.isLoggedIn ? setupRankingGame : setupGuestGame}
                                setMessages={setMessages}
                                disableBoard={disableBoard}
                                setDisableBoard={setDisableBoard}
                                promotionMenu={promotionMenu}
                                setPromotionMenu={setPromotionMenu}
                            />
                        </UsersProvider>
                        <div className="game-sidebar">
                            <PrevMoves
                                setDisableBoard={setDisableBoard}
                                setPromotionMenu={setPromotionMenu}
                            />
                            {user.isLoggedIn && (
                                <Chat
                                    socket={socket}
                                    messages={messages}
                                />
                            )}
                        </div>
                    </ValidMovesProvider>
                </GameProvider>
            </div>
        </>
    );
}
