import { useEffect, useState } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useUsers } from '../../../contexts/UsersContext';
import PrevMovesButtons from './PrevMovesButtons';
import PrevMovesContainer from './PrevMovesContainer';

export default function PrevMoves({ setDisableBoard, setPromotionMenu, setShowResignMenu, gameType }) {
    const { game, dispatchGame } = useGame();
    const { users } = useUsers();
    const [currentMoveIdx, setCurrentMoveIdx] = useState(0);

    useEffect(() => {
        setCurrentMoveIdx(game.prevMoves.length - 1);
    }, [game.prevMoves]);

    function changePositions(index) {
        if (index < 0 || index >= game.prevMoves.length) return;
        setCurrentMoveIdx(index);

        if (game.prevMoves.length === index + 1 && !game.result) {
            setDisableBoard(false);
        } else {
            setPromotionMenu(false);
            setDisableBoard(true);
        }

        let fen;

        if (users.player.color === 'w') {
            fen = game.prevMoves[index][1];
        } else {
            fen = game.prevMoves[index][1].split(' ');
            fen[0] = fen[0].split('').reverse().join('');
            fen = fen.join(' ');
        }

        dispatchGame({
            type: 'NEW_POSITIONS',
            fen: fen
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
