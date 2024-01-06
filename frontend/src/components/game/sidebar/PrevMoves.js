import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../../contexts/GameContext';
import PrevMovesButtons from './PrevMovesButtons';
import PrevMovesContainer from './PrevMovesContainer';

export default function PrevMoves({ setDisableBoard, setPromotionMenu, setShowSurrenderMenu, gameType }) {
    const { game, dispatchGame } = useGame();
    const [currentMoveIdx, setCurrentMoveIdx] = useState(0);
    const positionsRef = useRef();

    useEffect(() => {
        setCurrentMoveIdx(game.prevMoves.length - 1);
    }, [game.prevMoves]);

    function changePositions(index) {
        if (index < 0 || index >= game.prevMoves.length) return;
        setCurrentMoveIdx(index);

        if (!positionsRef.current) {
            positionsRef.current = game.fen;

            setPromotionMenu(false);
            setDisableBoard(true);
        }

        if (game.prevMoves.length === index + 1 && !game.result) {
            dispatchGame({
                type: 'NEW_POSITIONS',
                fen: positionsRef.current
            });

            positionsRef.current = '';

            setDisableBoard(false);
        } else {
            dispatchGame({
                type: 'NEW_POSITIONS',
                fen: game.prevMoves[index][1]
            });
        }
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
                setShowSurrenderMenu={setShowSurrenderMenu}
                gameType={gameType}
            />
        </div>
    );
}
