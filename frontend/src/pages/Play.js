import Sidebar  from '../components/sidebars/PlaySidebar';
import Game from '../components/game/Game';
import { GameProvider } from '../contexts/GameContext';

export default function Play() {
    return (
        <div className="play-page">
            <GameProvider>
                <Game
                    disableBoard={true}
                />
                <Sidebar />
            </GameProvider>
        </div>
    );
}
