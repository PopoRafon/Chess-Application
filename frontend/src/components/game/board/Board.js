import { useEffect, useState, useRef } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useUsers } from '../../../contexts/UsersContext';
import SurrenderMenu from '../extra/SurrenderMenu';
import GameResultAlert from '../extra/GameResultAlert';
import BoardSideLetters from './BoardSideLetters';
import BoardSquares from './BoardSquares';
import Pieces from './Pieces';

export default function Board({ disableBoard, setDisableBoard, setPromotionMenu, gameType, showSurrenderMenu, setShowSurrenderMenu }) {
    const [showResultAlert, setShowResultAlert] = useState(false);
    const { game } = useGame();
    const { users } = useUsers();
    const rowsRef = useRef(users.player.color === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]);
    const colsRef = useRef(users.player.color === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']);

    useEffect(() => {
        if (game.result) {
            setShowResultAlert(true);
            setDisableBoard(true);
        }
    }, [game.result, setDisableBoard]);

    return (
        <div className="chess-board">
            {disableBoard && <div className="disable-board"></div>}
            {showResultAlert && (
                <GameResultAlert
                    setShowResultAlert={setShowResultAlert}
                    gameType={gameType}
                />
            )}
            {showSurrenderMenu && (
                <SurrenderMenu
                    setShowSurrenderMenu={setShowSurrenderMenu}
                />
            )}
            <BoardSquares
                rowsRef={rowsRef}
                colsRef={colsRef}
            />
            <Pieces
                setPromotionMenu={setPromotionMenu}
            />
            <BoardSideLetters
                letters={rowsRef.current}
                lettersType="rows"
            />
            <BoardSideLetters
                letters={colsRef.current}
                lettersType="cols"
            />
        </div>
    );
}
