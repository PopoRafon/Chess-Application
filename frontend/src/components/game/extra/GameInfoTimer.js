import { useEffect, useState, useRef } from 'react';
import { useGame } from '../../../contexts/GameContext';

export default function GameInfoTimer({ player }) {
    const { game } = useGame();
    const [timer, setTimer] = useState(player.lastMove ? Math.round(player.timer - (Date.now() / 1e3 - player.lastMove)) : player.timer);
    const lastMoveTimestamp = useRef((player.lastMove ?? Date.now()) - (6e2 - player.timer) * 1e3);

    useEffect(() => {
        if (!game.result && game.history.length >= 1 && game.turn === player.color) {
            lastMoveTimestamp.current = Date.now() - (6e2 - timer) * 1e3;
            const timerInterval = setInterval(() => {
                setTimer(() => Math.round(6e2 - (Date.now() - lastMoveTimestamp.current) / 1e3));
            }, 100);

            return () => clearInterval(timerInterval);
        }
        // eslint-disable-next-line
    }, [game.turn, game.result]);

    return (
        <div className={`game-timer ${(game.turn === player.color && !game.result) && 'game-timer-on'}`}>
            {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
        </div>
    );
}
