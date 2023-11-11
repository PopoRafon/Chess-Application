import { useState } from 'react';
import { UsersProvider } from '../contexts/UsersContext';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { setupComputerGame } from '../utils/GameRoom';
import PrevMoves from '../components/game/sidebar/PrevMoves';
import Game from '../components/game/board/Game';
import Navigation from '../components/core/Navigation';

export default function PlayComputer({ isLoaded }) {
    const [disableBoard, setDisableBoard] = useState(false);
    const [promotionMenu, setPromotionMenu] = useState({ show: false });
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState();

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
                                setMessages={setMessages}
                                gameSetup={setupComputerGame}
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
                        </div>
                    </ValidMovesProvider>
                </GameProvider>
            </div>
        </>
    );
}
