import { UsersProvider } from '../contexts/UsersContext';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { setupRankingGame, setupGuestGame } from '../utils/GameRoom';
import { GameSocketProvider } from '../contexts/GameSocketContext';
import { PromotionMenuProvider } from '../contexts/PromotionMenuContext';
import { useUser } from '../contexts/UserContext';
import Game from '../components/game/board/Game';
import Navigation from '../components/core/Navigation';

export default function PlayOnline({ isLoaded }) {
    const { user } = useUser();

    return isLoaded && (
        <>
            <Navigation />
            <div className="play-page">
                <GameProvider>
                    <ValidMovesProvider>
                        <UsersProvider>
                            <GameSocketProvider>
                                <PromotionMenuProvider>
                                    <Game
                                        gameType={user.isLoggedIn ? 'ranking' : 'guest'}
                                        gameSetup={user.isLoggedIn ? setupRankingGame : setupGuestGame}
                                    />
                                </PromotionMenuProvider>
                            </GameSocketProvider>
                        </UsersProvider>
                    </ValidMovesProvider>
                </GameProvider>
            </div>
        </>
    );
}
