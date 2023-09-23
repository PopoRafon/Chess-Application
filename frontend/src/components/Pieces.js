function Piece({ type, row, col }) {
    return (
        <div
            className={`piece ${type} p-${row}${col}`}
            >
        </div>
    );
}

function Pieces() {
    const positions = [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];

    return (
        <div className="pieces">
            {positions.map((row, i) => (
                row.map((col, j) => (
                    (positions[i][j] && (
                        <Piece
                            type={positions[i][j]}
                            row={i}
                            col={j}
                            key={i + '-' + j}
                        />
                    ))
                ))
            ))}
        </div>
    );
}

export default Pieces;
