import Sidebar  from '../components/sidebars/PlaySidebar';
import Game from '../components/game/Game';
import { PrevMovesProvider } from '../contexts/PreviousMovesContext';
import { PositionsProvider } from '../contexts/PositionsContext';

export default function Play() {
    return (
        <div className="play-page">
            <PositionsProvider>
                <PrevMovesProvider>
                    <Game
                        disableBoard={true}
                    />
                    <Sidebar />
                </PrevMovesProvider>
            </PositionsProvider>
        </div>
    );
}
