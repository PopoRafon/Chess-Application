export default function gameReducer(state, action) {
    switch (action.type) {
        case 'GAME_START':
            return {
                ...state,
                result: action.result,
                fen: action.fen,
                prevMoves: action.prevMoves
            }
        case 'NEXT_ROUND':
            return {
                ...state,
                fen: action.fen,
                prevMoves: [
                    ...state.prevMoves,
                    [...action.prevMoves]
                ]
            };
        case 'NEW_POSITIONS':
            return {
                ...state,
                fen: action.fen
            };
        case 'GAME_END':
            // new Audio('/static/sounds/game_end.mp3').play();

            return {
                ...state,
                result: action.result
            }
        default:
            throw new Error();
    }
}
