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

function calcKnightMoves(directions, positions, row, col) {
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

function calcKingMoves(directions, positions, row, col, castlingDirections) {
    const piece = positions[row][col];
    const side = piece[0] === 'w' ? '7' : '0';
    let viableMoves = calcKnightMoves(directions, positions, row, col);

    switch (castlingDirections[piece]) {
        case 'none':
            break;
        case 'both':
            if (positions[row][col - 1] === '' && positions[row][col - 2] === '' && positions[row][col - 3] === '') {
                viableMoves.push(`${side}2 valid-move`);
            }
            if (positions[row][col + 1] === '' && positions[row][col + 2] === '') {
                viableMoves.push(`${side}6 valid-move`);
            }
            break;
        case 'left':
            if (positions[row][col - 1] === '' && positions[row][col - 2] === '' && positions[row][col - 3] === '') {
                viableMoves.push(`${side}2 valid-move`);
            }
            break;
        case 'right':
            if (positions[row][col + 1] === '' && positions[row][col + 2] === '') {
                viableMoves.push(`${side}6 valid-move`);
            }
            break;
        default:
            throw new Error();
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

function getViableMoves(game, piece, row, col) {
    const { positions, turn, castlingDirections } = game;

    if (turn !== piece[0]) return [];

    switch (piece[1]) {
        case 'p':
            return calcPawnMoves(positions, piece, row, col);
        case 'n':
            return calcKnightMoves(knightDirections(), positions, row, col);
        case 'k':
            return calcKingMoves(kingDirections(), positions, row, col, castlingDirections);
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

function validateMove(game, data, row, col) {
    const viableMoves = getViableMoves(game, data[0], Number(data[1]), Number(data[2]));

    for (const move of viableMoves) {
        if (move.includes(`${row}${col}`)) {
            return true;
        }
    }

    return false;
}

export { validateMove, getViableMoves };
