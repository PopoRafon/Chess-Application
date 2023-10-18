export default function checkPinnedSquares(pinnedSquares, viableMoves, row, col) {
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
