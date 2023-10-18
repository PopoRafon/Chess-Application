export default function checkKingCheckSquares(kingCheckSquares, viableMoves) {
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
