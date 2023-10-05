import Sidebar from '../components/sidebars/PlayOnlineSidebar';
import Game from '../components/game/Game';
import { PrevMovesProvider } from '../contexts/PreviousMovesContext';
import { PositionsProvider } from '../contexts/PositionsContext';
import { useState } from 'react';

export default function PlayOnline() {
    const [disableBoard, setDisableBoard] = useState(false);

    return (
        <div className="play-page">
            <PositionsProvider>
                <PrevMovesProvider>
                    <Game
                        disableBoard={disableBoard}
                    />
                    <Sidebar
                        messages={[]}
                        setDisableBoard={setDisableBoard}
                    />
                </PrevMovesProvider>
            </PositionsProvider>
        </div>
    );
}
