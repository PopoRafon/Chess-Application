function queenDirections() {
    return [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];
}

function rookDirections() {
    return [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];
}

function bishopDirections() {
    return [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1]
    ];
}

function knightDirections() {
    return [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
    ];
}

function kingDirections() {
    return [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];
}

export { queenDirections, rookDirections, bishopDirections, knightDirections, kingDirections };
