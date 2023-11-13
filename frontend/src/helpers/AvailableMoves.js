import { getAvailableMoves } from './Moves';

export default function updateAvailableMoves(game, gameSocket, squares, availableMoves, dispatchGame, player) {
    const { turn, positions } = game;
    const { kingCheckSquares } = squares;
    let availableMovesLength = 0;
    availableMoves.current = { w: {}, b: {} };

    for (const [rowIdx, row] of positions.entries()) {
        for (const [colIdx, piece] of row.entries()) {
            if (!piece) continue;
            const viableMoves = getAvailableMoves(game, piece, rowIdx, colIdx, squares, player, false);
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

    if (player.color === turn && availableMovesLength === 0) {
        if (kingCheckSquares.current[turn].length > 0) {
            gameSocket.send(JSON.stringify({
                type: 'checkmate'
            }));
        } else {
            gameSocket.send(JSON.stringify({
                type: 'stalemate'
            }))
        }
    }
}
