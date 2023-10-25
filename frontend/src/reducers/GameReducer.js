export default function gameReducer(state, action) {
    switch (action.type) {
        case 'GAME_START':
            return {
                ...state,
                positions: action.positions,
                turn: action.turn,
                result: action.result
            }
        case 'NEXT_ROUND':
            const newTurn = state.turn === 'w' ? 'b' : 'w';
            const newCastlingDirections = action.castlingDirections ? action.castlingDirections : {};

            return {
                ...state,
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
        case 'GAME_END':
            new Audio('/static/sounds/game_end.mp3').play();

            return {
                ...state,
                result: action.result
            }
        default:
            throw new Error();
    }
}
