import { Chess } from 'chess.js';

export default function gameReducer(state, action) {
    const chess = action.type === 'GAME_END' ? '' : new Chess(action.fen);

    switch (action.type) {
        case 'GAME_START':
            return {
                ...state,
                result: action.result,
                fen: action.fen,
                board: chess.board(),
                turn: chess.turn()
            };
        case 'NEXT_ROUND':
            return {
                ...state,
                fen: action.fen,
                board: chess.board(),
                turn: chess.turn(),
                prevMoves: [
                    ...state.prevMoves,
                    [...action.prevMoves]
                ]
            };
        case 'NEW_POSITIONS':
            return {
                ...state,
                fen: action.fen,
                board: chess.board(),
            };
        case 'GAME_END':
            return {
                ...state,
                result: action.result
            };
        default:
            throw new Error();
    }
}
