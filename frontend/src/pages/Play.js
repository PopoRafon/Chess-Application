import Sidebar  from '../components/sidebars/PlaySidebar';
import Game from '../components/game/Game';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { useState } from 'react';
import { PointsProvider } from '../contexts/PointsContext';

export default function Play() {
    const [promotionMenu, setPromotionMenu] = useState({show: false});

    return (
        <div className="play-page">
            <GameProvider>
                <ValidMovesProvider>
                    <PointsProvider>
                        <Game
                            disableBoard={true}
                            promotionMenu={promotionMenu}
                            setPromotionMenu={setPromotionMenu}
                        />
                    </PointsProvider>
                    <Sidebar />
                </ValidMovesProvider>
            </GameProvider>
        </div>
    );
}
