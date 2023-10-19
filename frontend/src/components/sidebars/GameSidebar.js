import { usePoints } from '../../contexts/PointsContext';
import { useGame } from '../../contexts/GameContext';
import { useEffect, useState } from 'react';
import checkGameResult from '../../helpers/GameResult';

export default function GameSidebar({ player, user, rating }) {
    const { game, dispatchGame } = useGame();
    const { points } = usePoints();
    const [timer, setTimer] = useState(600);
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    useEffect(() => {
        if (!game.result) {
            let timerTimeout;
    
            if (timer === 0) {
                const gameResult = checkGameResult(game.positions, player);

                dispatchGame({
                    type: 'GAME_END',
                    result: `Timeout! ${gameResult === 'draw' ? 'Draw!' : (gameResult === 'w' ? 'White wins!' : 'Black wins!')}`
                });
            } else if (game.turn === player) {
                timerTimeout = setTimeout(() => {
                    setTimer(prevTimer => prevTimer - 1);
                }, 1000);
            }
    
            return () => {
                clearTimeout(timerTimeout);
            };
        }
    });

    return (
        <div className="game-sidebar">
            <img
                src='/static/images/avatar.png'
                className="game-user-avatar"
                alt="Avatar"
            />
            <div className="player-information">
                <span>{user}</span>
                {rating && (
                    <span className="game-user-rating">({rating})</span>
                )}
                <div className="game-points">Points: +{points[player] ? points[player] : '0'}</div>
            </div>
            <div
                className={`game-timer ${(game.turn === player && !game.result) ? 'game-timer-on' : ''}`}
            >
                {formattedTimer}
            </div>
        </div>
    );
}
