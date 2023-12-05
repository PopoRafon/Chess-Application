import { useEffect, useState } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useUsers } from '../../../contexts/UsersContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';

export default function GameInfo({ player, gameType }) {
    const { gameSocket } = useGameSocket();
    const { game } = useGame();
    const { users } = useUsers();
    const [timer, setTimer] = useState(users[player].timer);
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    useEffect(() => {
        if (gameType !== 'computer' && !game.result && game.prevMoves.length !== 0) {
            let timerTimeout;

            if (timer <= 0) {
                gameSocket.send(JSON.stringify({ type: 'timeout' }));
            } else if (game.turn === users[player].color) {
                timerTimeout = setTimeout(() => {
                    setTimer(prevTimer => prevTimer - 1);
                }, 1000);
            }

            return () => {
                clearTimeout(timerTimeout);
            };
        }
        // eslint-disable-next-line
    }, [game.result, game.turn, timer]);

    return (
        <div className="game-info">
            <img
                src={users[player].avatar}
                className="game-user-avatar"
                alt="Avatar"
            />
            <div className="player-info">
                <span>{users[player].username}</span>
                {users[player].rating && (
                    <span className="game-user-rating">({users[player].rating})</span>
                )}
                <div className="game-points">Points: {users[player].points}</div>
            </div>
            {gameType !== 'computer' && (
                <div
                    className={`game-timer ${(game.turn === player && !game.result) && 'game-timer-on'}`}
                >
                    {formattedTimer}
                </div>
            )}
        </div>
    );
}
