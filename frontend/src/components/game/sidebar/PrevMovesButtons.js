import { useState } from 'react';
import { useSurrenderMenu } from '../../../contexts/SurrenderMenuContext';

export default function PrevMovesButtons({ changePositions, currentMoveIdx }) {
    const { setSurrenderMenu } = useSurrenderMenu();
    const [newGame, setNewGame] = useState(false);
    const [prevMove, setPrevMove] = useState(false);
    const [nextMove, setNextMove] = useState(false);

    function handleMoveShift(shift) {
        return () => changePositions(currentMoveIdx + shift);
    }

    function handleSurrender() {
        setSurrenderMenu(true);
    }

    return (
        <div className="prev-moves-buttons-container">
            <button
                className="prev-moves-button"
                onClick={handleSurrender}
                onMouseEnter={() => setNewGame(true)}
                onMouseLeave={() => setNewGame(false)}
            >
                <img style={{ width: '25px', height: '25px' }} src="/static/images/icons/surrender_icon.png" alt="Surrender" />
                {newGame && <div className="tooltip">Surrender</div>}
            </button>
            <button
                className="prev-moves-button"
                style={{ margin: "6px" }}
                onClick={handleMoveShift(-1)}
                onMouseEnter={() => setPrevMove(true)}
                onMouseLeave={() => setPrevMove(false)}
            >
                <img src="/static/images/icons/move_back_icon.png" alt="Move Back" />
                {prevMove && <div className="tooltip">Prev move</div>}
            </button>
            <button
                className="prev-moves-button"
                onClick={handleMoveShift(1)}
                onMouseEnter={() => setNextMove(true)}
                onMouseLeave={() => setNextMove(false)}
            >
                <img src="/static/images/icons/move_forward_icon.png" alt="Move Forward" />
                {nextMove && <div className="tooltip">Next move</div>}
            </button>
        </div>
    );
}
