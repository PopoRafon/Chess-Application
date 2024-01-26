import { useEffect, useState, useRef } from 'react';
import { useGame } from '#contexts/GameContext';
import { useUsers } from '#contexts/UsersContext';
import Pieces from './Pieces';
import ResignMenu from '../extra/ResignMenu';
import GameResultAlert from '../extra/GameResultAlert';
import BoardCoordinates from './BoardCoordinates';
import BoardSquares from './BoardSquares';

export default function Board({ disableBoard, setDisableBoard, setPromotionMenu, gameType, showResignMenu, setShowResignMenu }) {
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
            {showResignMenu && (
                <ResignMenu
                    setShowResignMenu={setShowResignMenu}
                />
            )}
            <BoardSquares
                rowsRef={rowsRef}
                colsRef={colsRef}
            />
            <Pieces
                rowsRef={rowsRef}
                colsRef={colsRef}
                setPromotionMenu={setPromotionMenu}
            />
            <BoardCoordinates
                coordinates={rowsRef.current}
                coordinatesType="rows"
            />
            <BoardCoordinates
                coordinates={colsRef.current}
                coordinatesType="cols"
            />
        </div>
    );
}
