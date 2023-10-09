import Sidebar from '../components/sidebars/PlayOnlineSidebar';
import Game from '../components/game/Game';
import { GameProvider } from '../contexts/GameContext';
import { useState } from 'react';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { PointsProvider } from '../contexts/PointsContext';

export default function PlayOnline() {
    const [disableBoard, setDisableBoard] = useState(false);
    const [promotionMenu, setPromotionMenu] = useState({show: false});

    return (
        <div className="play-page">
            <GameProvider>
                <ValidMovesProvider>
                    <PointsProvider>
                        <Game
                            disableBoard={disableBoard}
                            promotionMenu={promotionMenu}
                            setPromotionMenu={setPromotionMenu}
                        />
                    </PointsProvider>
                    <Sidebar
                        messages={[]}
                        setDisableBoard={setDisableBoard}
                        setPromotionMenu={setPromotionMenu}
                    />
                </ValidMovesProvider>
            </GameProvider>
        </div>
    );
}
