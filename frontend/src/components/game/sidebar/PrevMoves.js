import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useValidMoves } from '../../../contexts/ValidMovesContext';
import PrevMovesButtons from './PrevMovesButtons';
import PrevMovesContainer from './PrevMovesContainer';

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
