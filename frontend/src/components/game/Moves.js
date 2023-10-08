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
                viableMoves.push(`${y}${x} mark`);
                break;
            }
            viableMoves.push(`${y}${x} valid-move`);
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
        const rowY = row + y;
        const colX = col + x;

        if ((rowY < 0 || colX < 0 || rowY > 7 || colX > 7) || positions[rowY][colX][0] === positions[row][col][0]) {
            continue;
        } else if (positions[rowY][colX][0] && positions[rowY][colX][0] !== positions[row][col][0]) {
            viableMoves.push(`${rowY}${colX} mark`);
        } else {
            viableMoves.push(`${rowY}${colX} valid-move`);
        }
    }

    return viableMoves;
}

function calcPawnMoves(positions, type, row, col) {
    let viableMoves = [];

    const direction = type[0] === 'w' ? -1 : 1;
    const startingPos = type[0] === 'w' ? 6 : 1;

    if (positions[row + direction][col] === '') {
        viableMoves.push(`${row + direction}${col} valid-move`);
        if (row === startingPos && positions[startingPos + direction * 2][col] === '') {
            viableMoves.push(`${row + direction * 2}${col} valid-move`);
        }
    }

    if (col - 1 >= 0 && positions[row + direction][col - 1] !== '' && positions[row + direction][col - 1][0] !== type[0]) {
        viableMoves.push(`${row + direction}${col - 1} mark`);
    }
    if (col + 1 <= 7 && positions[row + direction][col + 1] !== '' && positions[row + direction][col + 1][0] !== type[0]) {
        viableMoves.push(`${row + direction}${col + 1} mark`);
    }

    return viableMoves;
}

function getViableMoves(positions, piece, row, col) {
    switch (piece[1]) {
        case 'p':
            return calcPawnMoves(positions, piece, row, col);
        case 'n':
            return calcKingKnightMoves(knightDirections(), positions, row, col);
        case 'k':
            return calcKingKnightMoves(kingDirections(), positions, row, col);
        case 'r':
            return calcQueenRookBishopMoves(rookDirections(), positions, row, col);
        case 'b':
            return calcQueenRookBishopMoves(bishopDirections(), positions, row, col);
        case 'q':
            return calcQueenRookBishopMoves(queenDirections(), positions, row, col);
        default:
            throw new Error();
    }
}

function validateMove(positions, data, row, col, turn) {
    const piece = data[0];

    if (turn !== piece[0]) return false;

    const viableMoves = getViableMoves(positions, piece, Number(data[1]), Number(data[2]));

    for (const move of viableMoves) {
        if (move.includes(`${row}${col}`)) {
            return true;
        }
    }

    return false;
}

export { validateMove, getViableMoves };
