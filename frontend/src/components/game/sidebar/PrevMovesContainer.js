import { useGame } from '#contexts/GameContext';

export default function PrevMovesContainer({ changePositions, currentMoveIdx }) {
    const { game } = useGame();

    function handleMoveChange(index) {
        return () => changePositions(index);
    }

    return (
        <div className="prev-moves-container">
            <div className="prev-moves-header">Previous Moves</div>
            <div className="prev-moves-content scrollbar">
                    {game.history.map((move, index) => (
                        index % 2 === 0 && (
                            <div
                                className="prev-moves"
                                key={index}
                            >
                                {index / 2 + 1}.
                                <button
                                    className={`prev-node ${(currentMoveIdx === index) && 'current-node'}`}
                                    onClick={handleMoveChange(index)}
                                >
                                    {move}
                                </button>
                                {game.history[index + 1] && (
                                    <button
                                        className={`prev-node ${(currentMoveIdx === (index + 1)) && 'current-node'}`}
                                        onClick={handleMoveChange(index + 1)}
                                    >
                                        {game.history[index + 1]}
                                    </button>
                                )}
                            </div>
                        )
                    ))}
            </div>
        </div>
    );
}
