import ChessBoard from './Board';

function GameSidebar() {
    return (
        <div className="game-sidebar">
            <img
                src='/static/images/avatar.png'
                className="game-user-avatar"
                alt="Avatar"
            />
            <div>
                <span>Username</span>
                <span className="game-user-rating">(800)</span>
            </div>
            <div className="game-timer">10:00</div>
        </div>
    );
}

function Game({ isDisabled }) {
    return (
        <div className="game-container">
            <div className="game-content">
                <GameSidebar />
                <ChessBoard isDisabled={isDisabled} />
                <GameSidebar />
            </div>
        </div>
    );
}

export default Game;
