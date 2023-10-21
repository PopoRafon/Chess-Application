import { useGame } from '../../contexts/GameContext';
import { useEffect, useState } from 'react';
import GameResultAlert from './GameResultAlert';
import Arbiter from './Arbiter';

function RowLetters({ rows }) {
    return (
        <div className="board-rows">
            {rows.map((row, index) => (
                <span
                    className={index % 2 === 0 ? 'black-letter' : 'white-letter'}
                    key={index}
                >
                    {row}
                </span>
            ))}
        </div>
    );
}

function ColLetters({ columns }) {
    return (
        <div className="board-cols">
            {columns.map((col, index) => (
                <span
                    className={index % 2 === 0 ? 'white-letter' : 'black-letter'}
                    key={index}
                >
                    {col}
                </span>
            ))}
        </div>
    );
}

function Square({ colIdx, rowIdx }) {
    return (
        <div
            className={(colIdx + rowIdx) % 2 === 0 ? 'white-square' : 'black-square'}
        >
        </div>
    );
}

function DisableChessBoard() {
    return (
        <div className="disable-board"></div>
    );
}

export default function ChessBoard({ users, disableBoard, setDisableBoard, setPromotionMenu }) {
    const [showResultAlert, setShowResultAlert] = useState(false);
    const { game } = useGame();
    const rows = [8, 7, 6, 5, 4, 3, 2, 1];
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let board = [];

    useEffect(() => {
        if (game.result) {
            setShowResultAlert(true);
            setDisableBoard(true);
        }
    }, [game.result, setDisableBoard]);
    
    for (const row of rows) {
        for (const col of cols) {
            board.push(
                <Square
                    rowIdx={rows.indexOf(row)}
                    colIdx={cols.indexOf(col)}
                    key={row + '-' + col}
                />
            );
        }
    }

    return (
        <div className="chess-board">
            {disableBoard && (
                <DisableChessBoard />
            )}
            {showResultAlert && (
                <GameResultAlert
                    users={users}
                    result={game.result}
                    setShowResultAlert={setShowResultAlert}
                />
            )}
            <div className="board-squares">{board}</div>
            <Arbiter
                setPromotionMenu={setPromotionMenu}
            />
            <RowLetters
                rows={rows}
            />
            <ColLetters
                columns={cols}
            />
        </div>
    );
}
