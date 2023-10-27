import { useEffect, useState, useRef } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useUsers } from '../../../contexts/UsersContext';
import GameResultAlert from '../extra/GameResultAlert';
import Arbiter from './Arbiter';

function RowLetters({ rows }) {
    const { users } = useUsers();
    const indexShift = useRef(users.player.color === 'b' ? 1 : 0);

    return (
        <div className="board-rows">
            {rows.map((row, index) => (
                <span
                    className={(index + indexShift.current) % 2 === 0 ? 'black-letter' : 'white-letter'}
                    key={index}
                >
                    {row}
                </span>
            ))}
        </div>
    );
}

function ColLetters({ columns }) {
    const { users } = useUsers();
    const indexShift = useRef(users.player.color === 'b' ? 1 : 0);

    return (
        <div className="board-cols">
            {columns.map((col, index) => (
                <span
                    className={(index + indexShift.current) % 2 === 0 ? 'white-letter' : 'black-letter'}
                    key={index}
                >
                    {col}
                </span>
            ))}
        </div>
    );
}

function Square({ colIdx, rowIdx }) {
    const { users } = useUsers();

    if (users.player.color === 'b') colIdx++;

    return <div className={(colIdx + rowIdx) % 2 === 0 ? 'white-square' : 'black-square'}></div>;
}

function DisableChessBoard() {
    return <div className="disable-board"></div>;
}

export default function ChessBoard({ disableBoard, setDisableBoard, setPromotionMenu }) {
    const [showResultAlert, setShowResultAlert] = useState(false);
    const { users } = useUsers();
    const { game } = useGame();
    const rows = [8, 7, 6, 5, 4, 3, 2, 1];
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    useEffect(() => {
        if (game.result) {
            setShowResultAlert(true);
            setDisableBoard(true);
        }
    }, [game.result, setDisableBoard]);

    return (
        <div className="chess-board">
            {disableBoard && (
                <DisableChessBoard />
            )}
            {showResultAlert && (
                <GameResultAlert
                    setShowResultAlert={setShowResultAlert}
                />
            )}
            <div className="board-squares">
                {rows.map((_, rowIdx) => (
                    cols.map((_, colIdx) => (
                        <Square
                            rowIdx={rowIdx}
                            colIdx={colIdx}
                            key={`${rowIdx}${colIdx}`}
                        />   
                    ))
                ))}
            </div>
            <Arbiter
                setPromotionMenu={setPromotionMenu}
            />
            <RowLetters
                rows={users.player.color === 'w' ? rows : rows.reverse()}
            />
            <ColLetters
                columns={users.player.color === 'w' ? cols : cols.reverse()}
            />
        </div>
    );
}
