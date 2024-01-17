import { useEffect, useState } from 'react';
import { useGame } from '../../../contexts/GameContext';
import PrevMovesButtons from './PrevMovesButtons';
import PrevMovesContainer from './PrevMovesContainer';

export default function PrevMoves({ setDisableBoard, setPromotionMenu, setShowResignMenu, gameType }) {
    const { game, dispatchGame } = useGame();
    const [currentMoveIdx, setCurrentMoveIdx] = useState(0);

    useEffect(() => {
        setCurrentMoveIdx(game.history.length - 1);
    }, [game.history]);

    function changePositions(index) {
        if (index < 0 || index >= game.history.length) return;
        setCurrentMoveIdx(index);

        if (game.history.length === index + 1 && !game.result) {
            setDisableBoard(false);
        } else {
            setPromotionMenu(false);
            setDisableBoard(true);
        }

        dispatchGame({
            type: 'LOAD_PREVIOUS_POSITIONS',
            index: index
        });
    }

    return (
        <div className="prev-moves">
            <PrevMovesContainer
                changePositions={changePositions}
                currentMoveIdx={currentMoveIdx}
            />
            <PrevMovesButtons
                changePositions={changePositions}
                currentMoveIdx={currentMoveIdx}
                setShowResignMenu={setShowResignMenu}
                gameType={gameType}
            />
        </div>
    );
}
