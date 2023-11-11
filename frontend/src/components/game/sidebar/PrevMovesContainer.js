export default function PrevMovesContainer({ changePositions, game, currentMoveIndex }) {
    function handleMoveChange(index) {
        return () => changePositions(index);
    }

    return (
        <div className="prev-moves-container">
            <div className="prev-moves-header">Previous Moves</div>
            <div className="prev-moves-content scrollbar">
                <ol>
                    {game.prevMoves.map((move, index) => (
                        index % 2 === 0 && (
                            <li
                                className="move"
                                key={index}
                            >
                                <button
                                    className={`prev-move ${(currentMoveIndex === index) && 'current-move'}`}
                                    onClick={handleMoveChange(index)}
                                >
                                    {move[0]}
                                </button>
                                {game.prevMoves[index + 1] && (
                                    <button
                                        className={`prev-move ${(currentMoveIndex === index + 1) && 'current-move'}`}
                                        onClick={handleMoveChange(index + 1)}
                                    >
                                        {game.prevMoves[index + 1][0]}
                                    </button>
                                )}
                            </li>
                        )
                    ))}
                </ol>
            </div>
        </div>
    );
}
