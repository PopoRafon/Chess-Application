import { UsersProvider } from '../contexts/UsersContext';
import { GameProvider } from '../contexts/GameContext';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { setupComputerGame } from '../utils/GameRoom';
import { GameSocketProvider } from '../contexts/GameSocketContext';
import { PromotionMenuProvider } from '../contexts/PromotionMenuContext';
import { useUser } from '../contexts/UserContext';
import Game from '../components/game/board/Game';
import Navigation from '../components/core/Navigation';

export default function PlayComputer() {
    const { user } = useUser();

    return (
        <>
            <Navigation />
            <div className="play-page">
                <GameProvider>
                    <ValidMovesProvider>
                        <UsersProvider>
                            <GameSocketProvider>
                                <PromotionMenuProvider>
                                    <Game
                                        gameType={'computer'}
                                        gameSetup={(setSocket) => setupComputerGame(setSocket, user)}
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
