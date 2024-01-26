import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '#contexts/UsersContext';
import { useGame } from '#contexts/GameContext';
import Cookies from 'js-cookie';

export default function GameResultAlert({ setShowResultAlert, gameType }) {
    const { users } = useUsers();
    const { game } = useGame();
    const [playerWinner, setPlayerWinner] = useState(false);
    const [enemyWinner, setEnemyWinner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (game.result.includes(users.player.color === 'w' ? 'white' : 'black')) {
            setPlayerWinner(true);
        } else if (!game.result.includes('draw')) {
            setEnemyWinner(true);
        }
    }, [setPlayerWinner, setEnemyWinner, game.result, users.player.color]);

    function handleGameExit() {
        if (gameType === 'ranking') {
            Cookies.remove('ranking_game_url');
        } else if (gameType === 'guest') {
            Cookies.remove('guest_game_token');
            Cookies.remove('guest_game_url');
        } else {
            Cookies.remove('computer_game_token');
            Cookies.remove('computer_game_url');
        }

        navigate('/play');
    }

    return (
        <div className="game-result-alert">
            <button
                className="game-result-exit-button"
                onClick={() => setShowResultAlert(false)}
            >
            </button>
            <div className="game-result-header">
                <span className="game-result-header-decision">{playerWinner ? 'You won!' : enemyWinner ? 'You lost!' : 'Draw!'}</span>
                <span className="game-result-header-description">by {game.result.split('by:')[1]}</span>
            </div>
            <div className="game-result-body">
                <div className="game-result-user">
                    <img
                        src={users.player.avatar}
                        className={`game-result-avatar ${playerWinner && 'game-result-winner'}`}
                        alt="Avatar"
                    />
                    <span className="game-result-username">{users.player.username}</span>
                </div>
                <span style={{ fontWeight: '600' }}>VS</span>
                <div className="game-result-user">
                    <img
                        src={users.enemy.avatar}
                        className={`game-result-avatar ${enemyWinner && 'game-result-winner'}`}
                        alt="Avatar"
                    />
                    <span className="game-result-username">{users.enemy.username}</span>
                </div>
            </div>
            <div className="game-result-footer">
                <button
                    className="game-result-exit-game-button"
                    onClick={handleGameExit}
                >
                    Exit Game
                </button>
            </div>
        </div>
    );
}
