import { useEffect, useState } from 'react';
import { useUsers } from '../../../contexts/UsersContext';
import { useGame } from '../../../contexts/GameContext';

export default function GameResultAlert({ setShowResultAlert }) {
    const { users } = useUsers();
    const { game } = useGame();
    const [playerWinner, setPlayerWinner] = useState(false);
    const [enemyWinner, setEnemyWinner] = useState(false);

    useEffect(() => {
        if (game.result.includes(users.player.color === 'w' ? 'White' : 'Black')) {
            setPlayerWinner(true);
        } else {
            setEnemyWinner(true);
        }
    }, [setPlayerWinner, setEnemyWinner, game.result, users.player.color]);

    return (
        <div className="game-result-alert">
            <button
                className="game-result-exit-button"
                onClick={() => setShowResultAlert(false)}
            >
            </button>
            <span className="game-result-header">{game.result}</span>
            <div className="game-result-body">
                <div className="game-result-user">
                    <img
                        src='/static/images/avatar.png'
                        className={`game-result-avatar ${playerWinner && 'game-result-winner'}`}
                        alt="Avatar"
                    />
                    <span className="game-result-username">{users.player.username}</span>
                </div>
                VS
                <div className="game-result-user">
                    <img
                        src='/static/images/avatar.png'
                        className={`game-result-avatar ${enemyWinner && 'game-result-winner'}`}
                        alt="Avatar"
                    />
                    <span className="game-result-username">{users.enemy.username}</span>
                </div>
            </div>
            <div className="game-result-footer">
                <button
                    className="game-result-new-game-button"
                >
                    New Game
                </button>
            </div>
        </div>
    );
}
