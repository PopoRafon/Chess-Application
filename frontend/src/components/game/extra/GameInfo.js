import { Chess } from 'chess.js';
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
        if (gameType !== 'computer' && !game.result && game.prevMoves.length >= 1) {
            let timerTimeout;

            if (timer <= 0) {
                gameSocket.send(JSON.stringify({ type: 'timeout' }));
            } else if (new Chess(game.fen).turn() === users[player].color) {
                timerTimeout = setTimeout(() => {
                    setTimer(prevTimer => prevTimer - 1);
                }, 1000);
            }

            return () => {
                clearTimeout(timerTimeout);
            }
        }
        // eslint-disable-next-line
    }, [timer, game.prevMoves]);

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
                    className={`game-timer ${(new Chess(game.fen).turn() === users[player].color && !game.result) && 'game-timer-on'}`}
                >
                    {formattedTimer}
                </div>
            )}
        </div>
    );
}
