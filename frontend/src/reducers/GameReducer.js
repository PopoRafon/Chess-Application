export default function gameReducer(state, action) {
    switch (action.type) {
        case 'NEXT_ROUND':
            const newTurn = state.turn === 'w' ? 'b' : 'w';
            return {
                positions: action.positions,
                prevMoves: [
                    ...state.prevMoves,
                    action.prevMove
                ],
                turn: newTurn
            };
        case 'NEW_POSITIONS':
            return {
                ...state,
                positions: action.positions
            };
        default:
            throw new Error();
    }
}
