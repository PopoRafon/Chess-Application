import { useEffect, useState, useRef } from 'react';
import { useGame } from '../../../contexts/GameContext';
import SurrenderMenu from '../extra/SurrenderMenu';
import GameResultAlert from '../extra/GameResultAlert';
import BoardSideLetters from './BoardSideLetters';
import Pieces from './Pieces';

export default function Board({ disableBoard, setDisableBoard, setPromotionMenu, gameType, showSurrenderMenu, setShowSurrenderMenu }) {
    const [showResultAlert, setShowResultAlert] = useState(false);
    const { game } = useGame();
    const rowsRef = useRef([8, 7, 6, 5, 4, 3, 2, 1]);
    const colsRef = useRef(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);

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
            <div className="board-squares">
                {rowsRef.current.map((_, rowIdx) => (
                    colsRef.current.map((_, colIdx) => (
                        <div className={(colIdx + rowIdx) % 2 === 0 ? 'white-square' : 'black-square'}></div>
                    ))
                ))}
            </div>
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
