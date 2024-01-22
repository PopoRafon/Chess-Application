import { useMemo } from 'react';
import { useUsers } from '../../../contexts/UsersContext';
import GameInfoTimer from './GameInfoTimer';

export default function GameInfo({ playerType, gameType }) {
    const { users } = useUsers();
    const player = useMemo(() => users[playerType], [users, playerType]);

    return (
        <div className="game-info">
            <img
                src={player.avatar}
                className="game-user-avatar"
                alt="Avatar"
            />
            <div className="player-info">
                <span>{player.username}</span>
                <span className="game-user-rating">{player.rating && `(${player.rating})`}</span>
                <div className="game-points">Points: {player.points}</div>
            </div>
            {gameType !== 'computer' && (
                <GameInfoTimer
                    player={player}
                />
            )}
        </div>
    );
}
