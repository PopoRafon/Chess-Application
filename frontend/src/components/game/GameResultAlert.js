export default function GameResultAlert({ users, result, setShowResultAlert }) {
    function handleClick() {
        setShowResultAlert(false);
    }

    return (
        <div className="game-result-alert">
            <button
                className="game-result-exit-button"
                onClick={handleClick}
            >
            </button>
            <span className="game-result-header">{result}</span>
            <div className="game-result-body">
                <div className="game-result-user">
                    <img
                        src='/static/images/avatar.png'
                        className={`game-result-avatar ${result.includes('Black') ? 'game-result-winner' : ''}`}
                        alt="Avatar"
                    />
                    <span>{users[0].username}</span>
                </div>
                VS
                <div className="game-result-user">
                    <img
                        src='/static/images/avatar.png'
                        className={`game-result-avatar ${result.includes('White') ? 'game-result-winner' : ''}`}
                        alt="Avatar"
                    />
                    <span>{users[1].username}</span>
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
