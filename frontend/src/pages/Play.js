import Sidebar  from '../components/sidebars/PlaySidebar';
import Game from '../components/game/Game';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';

export default function Play() {
    return (
        <div className="play-page">
            <GameProvider>
                <ValidMovesProvider>
                    <Game
                        disableBoard={true}
                    />
                    <Sidebar />
                </ValidMovesProvider>
            </GameProvider>
        </div>
    );
}
