function GameSidebar() {
    return (
        <div className="game-sidebar">
            <img src='/static/images/avatar.png' className="game-user-avatar" alt="Avatar" />
            <div>
                <span>Username</span>
                <span className="game-user-rating">(800)</span>
            </div>
            <div className="game-timer">10:00</div>
        </div>
    );
}

function Column({ column, idx }) {
    return (
        <div>
            {column.map((square, index) => (
                <div className={(index + idx) % 2 === 1 ? 'black-square' : 'white-square'} key={index}>
                    <div className="square-number">
                        {idx === 0 ? index + 1 : ''}
                    </div>
                    <div className="square-letter">
                        {index === 7 ? 'ABCDEFGH'[idx] : ''}
                    </div>
                </div>
            ))}
        </div>
    );
}

function Board() {
    const board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]]

    return (
        <div className="game-board">
            {board.map((column, index) => (
                <Column column={column} key={index} idx={index} />
            ))}
        </div>
    );
}

function Game() {
    return (
        <div className="game-container">
            <div className="game-content">
                <GameSidebar />
                <Board />
                <GameSidebar />
            </div>
        </div>
    );
}

export default Game;
