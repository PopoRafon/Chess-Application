import Pieces from './Pieces';

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
        <div className="disable-board">
        </div>
    );
}

export default function ChessBoard({ disableBoard, setPromotionMenu }) {
    let board = [];

    const rows = [8, 7, 6, 5, 4, 3, 2, 1];
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
            <div className="board-squares">{board}</div>
            <Pieces
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
