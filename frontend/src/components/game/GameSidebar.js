import { usePoints } from '../../contexts/PointsContext';
import { useGame } from '../../contexts/GameContext';
import { useEffect, useState } from 'react';

export default function GameSidebar({ player, user, rating }) {
    const { game } = useGame();
    const { points } = usePoints();
    const [timer, setTimer] = useState(600);
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    useEffect(() => {
        let timerInterval;

        if (game.turn === player) {
            timerInterval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [game, player]);

    return (
        <div className="game-sidebar">
            <img
                src='/static/images/avatar.png'
                className="game-user-avatar"
                alt="Avatar"
            />
            <div className="player-information">
                <span>{user}</span>
                {rating ? (
                    <span className="game-user-rating">({rating})</span>
                ) : (
                    ''
                )}
                <div className="game-points">Points: +{points[player] ? points[player] : '0'}</div>
            </div>
            <div
                className={`game-timer ${game.turn === player ? 'game-timer-on' : ''}`}
            >
                {formattedTimer}
            </div>
        </div>
    );
}
