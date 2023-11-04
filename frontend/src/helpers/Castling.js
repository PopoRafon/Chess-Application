export default function checkCastling(positions, castling, attackedSquares, playerColor) {
    return castling.every((position) => !positions[position[0]][position[1]] && !attackedSquares.current[playerColor].includes(position));
}
