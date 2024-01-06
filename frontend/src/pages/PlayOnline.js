import { UsersProvider } from '../contexts/UsersContext';
import { GameProvider } from '../contexts/GameContext';
import { setupRankingGame, setupGuestGame } from '../utils/GameRoom';
import { GameSocketProvider } from '../contexts/GameSocketContext';
import { useUser } from '../contexts/UserContext';
import Game from '../components/game/board/Game';

export default function PlayOnline() {
    const { user } = useUser();

    return (
        <div className="play-page">
            <GameProvider>
                <UsersProvider>
                    <GameSocketProvider>
                        <Game
                            gameType={user.isLoggedIn ? 'ranking' : 'guest'}
                            gameSetup={user.isLoggedIn ? setupRankingGame : setupGuestGame}
                        />
                    </GameSocketProvider>
                </UsersProvider>
            </GameProvider>
        </div>
    );
}
