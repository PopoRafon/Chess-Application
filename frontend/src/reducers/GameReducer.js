export default function gameReducer(state, action) {
    switch (action.type) {
        case 'GAME_START':
            return {
                ...state,
                positions: action.positions,
                turn: action.turn,
                result: action.result,
                castling: action.castling
            }
        case 'NEXT_ROUND':
            return {
                ...state,
                positions: action.positions,
                markedSquares: action.markedSquares,
                turn: action.turn,
                prevMoves: [
                    ...state.prevMoves,
                    [...action.prevMoves]
                ],
                castling: action.castling || state.castling
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
