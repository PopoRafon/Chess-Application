function initPositionsSetup() {
    return [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
}

export default function initGameState() {
    return {
        positions: initPositionsSetup(),
        prevMoves: [],
        markedSquares: [],
        turn: 'w',
        castlingDirections: {
            wk: 'both',
            bk: 'both'
        },
        result: ''
    };
};
