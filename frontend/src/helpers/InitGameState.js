export default function initGameState() {
    return {
        prevMoves: [],
        markedSquares: [],
        castlingDirections: {
            wk: 'both',
            bk: 'both'
        }
    };
}
