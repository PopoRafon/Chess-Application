export default function checkCastling(positions, castlingPositions, attackedSquares, playerColor) {
    return castlingPositions.every((position) => !positions[position[0]][position[1]] && !attackedSquares.current[playerColor].includes(position));
}
