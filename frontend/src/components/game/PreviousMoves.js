import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useValidMoves } from '../../contexts/ValidMovesContext';

function PrevMovesButtons({ changePositions, currentMoveIndex }) {
    function handleClick(shift) {
        changePositions(currentMoveIndex + shift);
    }

    return (
        <div className="play-online-sidebar-buttons-container">
            <button
                className="play-online-sidebar-button tooltip-trigger"
            >
                <img src="/static/images/icons/new_game_icon.png" alt="New Game" />
                <div className="tooltip">New game</div>
            </button>
            <button
                className="play-online-sidebar-button tooltip-trigger"
                style={{margin: "6px"}}
                onClick={() => handleClick(-1)}
            >
                <img src="/static/images/icons/move_back_icon.png" alt="Move Back" />
                <div className="tooltip">Prev move</div>
            </button>
            <button
                className="play-online-sidebar-button tooltip-trigger"
                onClick={() => handleClick(1)}
            >
                <img src="/static/images/icons/move_forward_icon.png" alt="Move Forward" />
                <div className="tooltip">Next move</div>
            </button>
        </div>
    );
}

function PrevMovesContainer({ changePositions, game, currentMoveIndex }) {
    function handleClick(index) {
        changePositions(index);
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
                                    className={`prev-move ${currentMoveIndex === index ? 'current-move' : ''}`}
                                    onClick={() => handleClick(index)}
                                >
                                    {move[0]}
                                </button>
                                {game.prevMoves[index + 1] && (
                                    <button
                                        className={`prev-move ${currentMoveIndex === index + 1 ? 'current-move' : ''}`}
                                        onClick={() => handleClick(index + 1)}
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

export default function PrevMoves({ setDisableBoard, setPromotionMenu }) {
    const { game, dispatchGame } = useGame();
    const { setValidMoves } = useValidMoves();
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const refPositions = useRef();

    useEffect(() => {
        setCurrentMoveIndex(game.prevMoves.length - 1);
    }, [game.prevMoves]);

    function changePositions(index) {
        if (index < 0 || index >= game.prevMoves.length) return;
        setCurrentMoveIndex(index);

        if (!refPositions.current) {
            refPositions.current = game.positions;
            setValidMoves([]);
            setPromotionMenu(false);
            setDisableBoard(true);
        }

        if (game.prevMoves.length === index + 1 && !game.result) {
            dispatchGame({
                type: 'NEW_POSITIONS',
                positions: refPositions.current,
                markedSquares: game.prevMoves[game.prevMoves.length - 1][2]
            });
            refPositions.current = '';
            setDisableBoard(false);
        } else {
            dispatchGame({
                type: 'NEW_POSITIONS',
                positions: game.prevMoves[index][1],
                markedSquares: game.prevMoves[index][2]
            });
        }
    }

    return (
        <div className="prev-moves">
            <PrevMovesContainer
                changePositions={changePositions}
                game={game}
                currentMoveIndex={currentMoveIndex}
            />
            <PrevMovesButtons
                changePositions={changePositions}
                currentMoveIndex={currentMoveIndex}
            />
        </div>
    );
}
