import initPositionsSetup from '../helpers/InitialPositionsSetup';

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
