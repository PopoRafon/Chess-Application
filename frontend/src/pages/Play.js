import Sidebar  from '../components/sidebars/PlaySidebar';
import Game from '../components/game/Game';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { useState } from 'react';

export default function Play() {
    const [promotionMenu, setPromotionMenu] = useState({show: false});

    return (
        <div className="play-page">
            <GameProvider>
                <ValidMovesProvider>
                    <Game
                        disableBoard={true}
                        promotionMenu={promotionMenu}
                        setPromotionMenu={setPromotionMenu}
                    />
                    <Sidebar />
                </ValidMovesProvider>
            </GameProvider>
        </div>
    );
}
