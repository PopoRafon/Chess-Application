import { useGame } from '../../../contexts/GameContext';

export default function PrevMovesContainer({ changePositions, currentMoveIdx }) {
    const { game } = useGame();

    function handleMoveChange(index) {
        return () => changePositions(index);
    }

    return (
        <div className="prev-moves-container">
            <div className="prev-moves-header">Previous Moves</div>
            <div className="prev-moves-content scrollbar">
                <ol>
                    {game.history.map((move, index) => (
                        index % 2 === 0 && (
                            <li
                                className="move"
                                key={index}
                            >
                                <button
                                    className={`prev-move ${(currentMoveIdx === index) && 'current-move'}`}
                                    onClick={handleMoveChange(index)}
                                >
                                    {move}
                                </button>
                                {game.history[index + 1] && (
                                    <button
                                        className={`prev-move ${(currentMoveIdx === (index + 1)) && 'current-move'}`}
                                        onClick={handleMoveChange(index + 1)}
                                    >
                                        {game.history[index + 1]}
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
