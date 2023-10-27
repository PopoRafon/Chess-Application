import { getAvailableMoves } from './Moves';

export default function updateSquares(game, squares, player) {
    const { attackedSquares, kingCheckSquares, pinnedSquares } = squares;
    const { positions } = game;
    attackedSquares.current = { w: [], b: [] };
    kingCheckSquares.current = { w: [], b: [] };
    pinnedSquares.current = { w: [], b: [] };

    for (const [rowIdx, row] of positions.entries()) {
        for (const [colIdx, piece] of row.entries()) {
            if (!piece) continue;
            const viableMoves = getAvailableMoves(game, piece, rowIdx, colIdx, squares, player, true);
            const oppositePlayerColor = piece[0] === 'w' ? 'b' : 'w';
            let newAttackedSquares = [];

            for (const [moveIdx, move] of viableMoves.entries()) {
                const position = positions[move[0]][move[1]];

                if (move.includes('pin')) {
                    let newMoveIdx = moveIdx;
                    let newPinnedSquares = [];

                    if ((piece[1] === 'r' || piece[1] === 'b' || piece[1] === 'q') && position[0] === oppositePlayerColor) {
                        while (true) {
                            newMoveIdx--;
                            const newMove = viableMoves[newMoveIdx];

                            newPinnedSquares.push(newMove);

                            if (Math.abs(Number(newMove[0]) - Number(rowIdx)) <= 1 && Math.abs(Number(newMove[1]) - Number(colIdx)) <= 1) {
                                break;
                            }
                        }
                    }

                    newPinnedSquares.push(`${rowIdx}${colIdx}`);

                    pinnedSquares.current = {
                        ...pinnedSquares.current,
                        [oppositePlayerColor]: [
                            ...kingCheckSquares.current[oppositePlayerColor],
                            [...newPinnedSquares]
                        ]
                    }
                } else {
                    newAttackedSquares.push(`${move[0]}${move[1]}`);

                    if (position[1] === 'k' && position[0] === oppositePlayerColor) {
                        let newKingCheckSquares = [`${rowIdx}${colIdx}`];

                        if (piece[1] === 'r' || piece[1] === 'b' || piece[1] === 'q') {
                            if (Math.abs(Number(move[0]) - Number(rowIdx)) > 1 || Math.abs(Number(move[1]) - Number(colIdx)) > 1) {
                                let newMoveIdx = moveIdx;

                                while (true) {
                                    newMoveIdx--;
                                    const newMove = viableMoves[newMoveIdx];

                                    newKingCheckSquares.push(newMove);

                                    if (Math.abs(Number(newMove[0]) - Number(rowIdx)) <= 1 && Math.abs(Number(newMove[1]) - Number(colIdx)) <= 1) {
                                        break;
                                    }
                                }
                            }
                        }

                        kingCheckSquares.current = {
                            ...kingCheckSquares.current,
                            [oppositePlayerColor]: [
                                ...kingCheckSquares.current[oppositePlayerColor],
                                [...newKingCheckSquares]
                            ]
                        };
                    }
                }
            }

            attackedSquares.current = {
                ...attackedSquares.current,
                [oppositePlayerColor]: [
                    ...attackedSquares.current[oppositePlayerColor],
                    ...newAttackedSquares
                ]
            };
        }
    }
}
