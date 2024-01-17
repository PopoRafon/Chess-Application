import { Chess } from 'chess.js';

export default function gameReducer(state, action) {
    const chess = action.type === 'GAME_END' ? '' : new Chess();

    switch (action.type) {
        case 'GAME_START':
            chess.loadPgn(action.pgn);

            return {
                result: action.result,
                fen: chess.fen(),
                pgn: chess.pgn().replace(/\n [*]/, '\n\n*'),
                history: chess.history(),
                board: chess.board(),
                turn: chess.turn()
            };
        case 'NEXT_ROUND':
            chess.loadPgn(state.pgn);
            chess.move(action.move)

            return {
                ...state,
                fen: chess.fen(),
                pgn: chess.pgn(),
                history: chess.history(),
                board: chess.board(),
                turn: chess.turn()
            };
        case 'LOAD_PREVIOUS_POSITIONS':
            for (let i = 0; i <= action.index; i++) {
                chess.move(state.history[i]);
            }

            return {
                ...state,
                board: chess.board()
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
