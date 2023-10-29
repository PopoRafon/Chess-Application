import { useEffect, useState } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useUsers } from '../../../contexts/UsersContext';
import checkGameResult from '../../../helpers/GameResult';

function convertToSeconds(timer) {
    const [hours, minutes, seconds] = timer.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

export default function GameInfo({ player, points }) {
    const { game, dispatchGame } = useGame();
    const { users } = useUsers();
    const [timer, setTimer] = useState(users[player].timer !== undefined && convertToSeconds(users[player].timer));
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    useEffect(() => {
        if (!game.result && game.prevMoves.length !== 0) {
            let timerTimeout;

            if (timer === 0) {
                const gameResult = checkGameResult(game.positions, users[player].color);

                dispatchGame({
                    type: 'GAME_END',
                    result: `Timeout! ${gameResult === 'draw' ? 'Draw!' : (gameResult === 'w' ? 'White wins!' : 'Black wins!')}`
                });
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
                src='/static/images/avatar.png'
                className="game-user-avatar"
                alt="Avatar"
            />
            <div className="player-info">
                <span>{users[player].username}</span>
                {users[player].rating && (
                    <span className="game-user-rating">({users[player].rating})</span>
                )}
                <div className="game-points">Points: +{points[users[player].color]}</div>
            </div>
            {users[player].timer !== undefined && (
                <div
                    className={`game-timer ${(game.turn === player && !game.result) && 'game-timer-on'}`}
                >
                    {formattedTimer}
                </div>
            )}
        </div>
    );
}
