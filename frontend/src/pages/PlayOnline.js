import { useState } from 'react';
import { UsersProvider } from '../contexts/UsersContext';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { setupUserGame, setupGuestGame } from '../utils/GameRoom';
import { useUser } from '../contexts/UserContext';
import Sidebar from '../components/game/sidebar/GameSidebar';
import Game from '../components/game/board/Game';
import Navigation from '../components/core/Navigation';

export default function PlayOnline({ isLoaded }) {
    const [disableBoard, setDisableBoard] = useState(false);
    const [promotionMenu, setPromotionMenu] = useState({ show: false });
    const { user } = useUser();

    return isLoaded &&(
        <>
            <Navigation />
            <div className="play-page">
                <GameProvider>
                    <ValidMovesProvider>
                        <UsersProvider>
                            <Game
                                gameSetup={user.isLoggedIn ? setupUserGame : setupGuestGame}
                                isLoaded={isLoaded}
                                disableBoard={disableBoard}
                                setDisableBoard={setDisableBoard}
                                promotionMenu={promotionMenu}
                                setPromotionMenu={setPromotionMenu}
                            />
                        </UsersProvider>
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
