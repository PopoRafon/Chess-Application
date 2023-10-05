import { usePrevMoves } from '../../contexts/PreviousMovesContext';
import { usePositions } from '../../contexts/PositionsContext';
import { useRef } from 'react';

function PrevMovesButtons() {
    return (
        <div className="play-online-sidebar-buttons-container">
            <button className="play-online-sidebar-button">
                <img src="/static/images/icons/new_game_icon.png" alt="New Game" />
            </button>
            <button className="play-online-sidebar-button" style={{margin: "6px"}}>
                <img src="/static/images/icons/move_back_icon.png" alt="Move Back" />
            </button>
            <button className="play-online-sidebar-button">
                <img src="/static/images/icons/move_forward_icon.png" alt="Move Forward" />
            </button>
        </div>
    );
}

function PrevMovesContainer({ setDisableBoard }) {
    const { positions, setPositions } = usePositions();
    const { prevMoves } = usePrevMoves();
    const refPositions = useRef();

    function handleClick(index) {
        if (!refPositions.current) {
            refPositions.current = positions;
            setDisableBoard(true);
        }

        if (prevMoves.length === index + 1) {
            setPositions(refPositions.current);
            refPositions.current = '';
            setDisableBoard(false);
        } else {
            setPositions(prevMoves[index][1]);
        }
    }

    return (
        <div className="prev-moves-container">
            <div className="prev-moves-header">Previous Moves</div>
            <div className="prev-moves-content">
                <ol>
                    {prevMoves.map((move, index) => (
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
                                {prevMoves[index + 1] && (
                                    <button
                                        className="prev-move-button"
                                        onClick={() => handleClick(index + 1)}
                                    >
                                        {prevMoves[index + 1][0]}
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
