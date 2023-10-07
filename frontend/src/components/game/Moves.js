import { queenDirections, rookDirections, bishopDirections, knightDirections, kingDirections } from '../../helpers/Directions';

function calcQueenRookBishopMoves(directions, positions, row, col) {
    let viableMoves = [];

    for (let i = 0; i < directions.length; i++) {
        let x = col;
        let y = row;

        x += directions[i][0];
        y += directions[i][1];
        while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            if ((x === col && y === row) || (positions[y][x][0] === positions[row][col][0])) {
                break;
            } else if (positions[y][x] !== '') {
                viableMoves.push(`${y}${x}`);
                break;
            }
            viableMoves.push(`${y}${x}`);
            x += directions[i][0];
            y += directions[i][1];
        }
    }

    return viableMoves;
}

function calcKingKnightMoves(directions, positions, row, col) {
    let viableMoves = [];

    for (const direction of directions) {
        const x = direction[1];
        const y = direction[0];

        if ((row + y < 0 || col + x < 0 || row + y > 7 || col + x > 7) || positions[row + y][col + x][0] === positions[row][col][0]) {
            continue;
        }
        viableMoves.push(`${row + y}${col + x}`);
    }

    return viableMoves;
}

function calcPawnMoves(positions, type, row, col) {
    let viableMoves = [];

    const direction = type[0] === 'w' ? -1 : 1;
    const startingPos = type[0] === 'w' ? 6 : 1;

    if (positions[row + direction][col] === '') {
        viableMoves.push(`${row + direction}${col}`);
        if (row === startingPos && positions[startingPos + direction * 2][col] === '') {
            viableMoves.push(`${row + direction * 2}${col}`);
        }
    }

    if (col - 1 >= 0 && positions[row + direction][col - 1] !== '' && positions[row + direction][col - 1][0] !== type[0]) {
        viableMoves.push(`${row + direction}${col - 1}`);
    }
    if (col + 1 <= 7 && positions[row + direction][col + 1] !== '' && positions[row + direction][col + 1][0] !== type[0]) {
        viableMoves.push(`${row + direction}${col + 1}`);
    }

    return viableMoves;
}

function getViableMoves(positions, piece, row, col) {
    let moves = [];

    if (piece[1] === 'p') moves = calcPawnMoves(positions, piece, row, col);

    if (piece[1] === 'n') moves = calcKingKnightMoves(knightDirections(), positions, row, col);

    if (piece[1] === 'k') moves = calcKingKnightMoves(kingDirections(), positions, row, col);

    if (piece[1] === 'r') moves = calcQueenRookBishopMoves(rookDirections(), positions, row, col);

    if (piece[1] === 'b') moves = calcQueenRookBishopMoves(bishopDirections(), positions, row, col);

    if (piece[1] === 'q') moves = calcQueenRookBishopMoves(queenDirections(), positions, row, col);

    return moves;
}

function validateMove(positions, data, row, col, turn) {
    const piece = data[0];
    const x = Number(data[2]);
    const y = Number(data[1]);

    if (turn !== piece[0]) return false;

    const viableMoves = getViableMoves(positions, piece, y, x);

    return viableMoves.includes(`${row}${col}`);
}

export { validateMove, getViableMoves };
