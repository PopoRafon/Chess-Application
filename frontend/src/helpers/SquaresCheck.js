function checkPinnedSquares(pinnedSquares, viableMoves, row, col) {
    if (pinnedSquares.length >= 1) {
        for (const squaresArray of pinnedSquares) {
            if (squaresArray[0].includes(`${row}${col}`)) {
                let newViableMoves = [];

                for (const square of squaresArray) {
                    for (const move of viableMoves) {
                        if (square[0] === move[0] && square[1] === move[1]) {
                            newViableMoves.push(move);
                        }
                    }
                }

                viableMoves = newViableMoves;
            }
        }
    }

    return viableMoves;
}

function checkKingCheckSquares(kingCheckSquares, viableMoves) {
    if (kingCheckSquares.length === 1) {
        let newViableMoves = [];

        for (const checkPosition of kingCheckSquares[0]) {
            for (const move of viableMoves) {
                if (move.includes(checkPosition)) {
                    newViableMoves.push(move);
                }
            }
        }

        return newViableMoves;
    } else if (kingCheckSquares.length >= 2) {
        return [];
    }

    return viableMoves;
}

export { checkPinnedSquares, checkKingCheckSquares };
