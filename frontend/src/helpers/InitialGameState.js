import initPositionsSetup from '../helpers/InitialPositionsSetup';

const initGameState = {
    positions: initPositionsSetup(),
    prevMoves: [],
    markedSquares: [],
    turn: 'w',
    castlingDirections: {
        wk: 'both',
        bk: 'both'
    }
};

export default initGameState;
