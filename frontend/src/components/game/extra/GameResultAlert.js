import { useUsers } from '../../../contexts/UsersContext';
import { useGame } from '../../../contexts/GameContext';

export default function GameResultAlert({ setShowResultAlert }) {
    const { users } = useUsers();
    const { game } = useGame();

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
                        className={`game-result-avatar ${game.result.includes('Black') && 'game-result-winner'}`}
                        alt="Avatar"
                    />
                    <span className="game-result-username">{users.b.username}</span>
                </div>
                VS
                <div className="game-result-user">
                    <img
                        src='/static/images/avatar.png'
                        className={`game-result-avatar ${game.result.includes('White') && 'game-result-winner'}`}
                        alt="Avatar"
                    />
                    <span className="game-result-username">{users.w.username}</span>
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
