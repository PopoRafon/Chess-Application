import { useState } from 'react';
import { UsersProvider } from '../contexts/UsersContext';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { setupComputerGame } from '../utils/GameRoom';
import Sidebar from '../components/sidebars/PlayOnlineSidebar';
import Game from '../components/game/Game';
import Navigation from '../components/sidebars/Navigation';

export default function PlayComputer({ isLoaded }) {
    const [disableBoard, setDisableBoard] = useState(false);
    const [promotionMenu, setPromotionMenu] = useState({ show: false });

    return isLoaded && (
        <>
            <Navigation />
            <div className="play-page">
                <GameProvider>
                    <ValidMovesProvider>
                        <UsersProvider>
                            <Game
                                gameSetup={setupComputerGame}
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
