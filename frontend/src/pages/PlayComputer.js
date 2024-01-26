import { UsersProvider } from '#contexts/UsersContext';
import { GameProvider } from '#contexts/GameContext';
import { setupComputerGame } from '#utils/GameRoom';
import { GameSocketProvider } from '#contexts/GameSocketContext';
import { useUser } from '#contexts/UserContext';
import Game from '#components/game/board/Game';

export default function PlayComputer() {
    const { user } = useUser();

    return (
        <div className="play-page">
            <GameProvider>
                <UsersProvider>
                    <GameSocketProvider>
                        <Game
                            gameType={'computer'}
                            gameSetup={(setSocket) => setupComputerGame(setSocket, user)}
                        />
                    </GameSocketProvider>
                </UsersProvider>
            </GameProvider>
        </div>
    );
}
