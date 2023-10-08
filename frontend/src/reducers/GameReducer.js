export default function gameReducer(state, action) {
    switch (action.type) {
        case 'NEXT_ROUND':
            const newTurn = state.turn === 'w' ? 'b' : 'w';
            const newCastlingDirections = action.castlingDirections ? action.castlingDirections : {};
            return {
                positions: action.positions,
                prevMoves: [
                    ...state.prevMoves,
                    action.prevMove
                ],
                markedSquares: action.markedSquares,
                turn: newTurn,
                castlingDirections: {
                    ...state.castlingDirections,
                    ...newCastlingDirections
                }
            };
        case 'NEW_POSITIONS':
            return {
                ...state,
                positions: action.positions,
                markedSquares: action.markedSquares
            };
        default:
            throw new Error();
    }
}
