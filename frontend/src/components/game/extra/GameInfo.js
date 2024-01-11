import { useRef } from 'react';
import { useUsers } from '../../../contexts/UsersContext';
import GameInfoTimer from './GameInfoTimer';

export default function GameInfo({ playerType, gameType }) {
    const { users } = useUsers();
    const player = useRef(users[playerType]);

    return (
        <div className="game-info">
            <img
                src={player.current.avatar}
                className="game-user-avatar"
                alt="Avatar"
            />
            <div className="player-info">
                <span>{player.current.username}</span>
                <span className="game-user-rating">{player.current.rating && `(${player.current.rating})`}</span>
                <div className="game-points">Points: {player.current.points}</div>
            </div>
            {gameType !== 'computer' && (
                <GameInfoTimer
                    player={player.current}
                />
            )}
        </div>
    );
}
