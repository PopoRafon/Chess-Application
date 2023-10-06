import Sidebar from '../components/sidebars/PlayOnlineSidebar';
import Game from '../components/game/Game';
import { GameProvider } from '../contexts/GameContext';
import { useState } from 'react';

export default function PlayOnline() {
    const [disableBoard, setDisableBoard] = useState(false);

    return (
        <div className="play-page">
            <GameProvider>
                <Game
                    disableBoard={disableBoard}
                />
                <Sidebar
                    messages={[]}
                    setDisableBoard={setDisableBoard}
                />
            </GameProvider>
        </div>
    );
}
