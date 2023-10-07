import { useGame } from '../../contexts/GameContext';
import { useRef } from 'react';
import { useValidMoves } from '../../contexts/ValidMovesContext';

function PrevMovesButtons() {
    return (
        <div className="play-online-sidebar-buttons-container">
            <button className="play-online-sidebar-button tooltip-trigger">
                <img src="/static/images/icons/new_game_icon.png" alt="New Game" />
                <div className="tooltip">New game</div>
            </button>
            <button className="play-online-sidebar-button tooltip-trigger" style={{margin: "6px"}}>
                <img src="/static/images/icons/move_back_icon.png" alt="Move Back" />
                <div className="tooltip">Prev move</div>
            </button>
            <button className="play-online-sidebar-button tooltip-trigger">
                <img src="/static/images/icons/move_forward_icon.png" alt="Move Forward" />
                <div className="tooltip">Next move</div>
            </button>
        </div>
    );
}

function PrevMovesContainer({ setDisableBoard }) {
    const { game, dispatchGame } = useGame();
    const { setValidMoves } = useValidMoves();
    const refPositions = useRef();

    function handleClick(index) {
        if (!refPositions.current) {
            refPositions.current = game.positions;
            setValidMoves([]);
            setDisableBoard(true);
        }

        if (game.prevMoves.length === index + 1) {
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
        <div className="prev-moves-container">
            <div className="prev-moves-header">Previous Moves</div>
            <div className="prev-moves-content">
                <ol>
                    {game.prevMoves.map((move, index) => (
                        index % 2 === 0 && (
                            <li
                                className="move"
                                key={index}
                            >
                                <button
                                    className="prev-move-button"
                                    onClick={() => handleClick(index)}
                                >
                                    {move[0]}
                                </button>
                                {game.prevMoves[index + 1] && (
                                    <button
                                        className="prev-move-button"
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

export default function PrevMoves({ setDisableBoard }) {
    return (
        <div className="prev-moves">
            <PrevMovesContainer
                setDisableBoard={setDisableBoard}
            />
            <PrevMovesButtons />
        </div>
    );
}
