import { getAvailableMoves } from '../components/game/Moves';

export default function updateAvailableMoves(game, squares, availableMoves, dispatchGame) {
    const { turn, positions } = game;
    const { kingCheckSquares } = squares;
    let availableMovesLength = 0;
    availableMoves.current = { w: {}, b: {} };

    for (const [rowIdx, row] of positions.entries()) {
        for (const [colIdx, piece] of row.entries()) {
            if (!piece) continue;
            const viableMoves = getAvailableMoves(game, piece, rowIdx, colIdx, squares, false);
            const piecePosition = `${rowIdx}${colIdx}`;

            availableMoves.current = {
                ...availableMoves.current,
                [piece[0]]: {
                    ...availableMoves.current[piece[0]],
                    [piecePosition]: [
                        ...viableMoves
                    ]
                }
            };
        }
    }

    for (const piecePositions of Object.values(availableMoves.current[turn])) {
        availableMovesLength += piecePositions.length;
    }

    if (availableMovesLength === 0) {
        if (kingCheckSquares.current[turn].length > 0) {
            dispatchGame({
                type: 'GAME_END',
                result: `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`
            });
        } else {
            dispatchGame({
                type: 'GAME_END',
                result: 'Stalemate! Draw!'
            });
        }
    }
}
