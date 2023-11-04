import { queenDirections, rookDirections, bishopDirections, knightDirections, kingDirections } from './Directions';
import { checkPinnedSquares, checkKingCheckSquares } from './SquaresCheck';
import checkCastling from './Castling';

function calcQueenRookBishopMoves(directions, positions, row, col, kingCheckSquares, pinnedSquares, isCheckingSquares) {
    let viableMoves = [];

    for (let i = 0; i < directions.length; i++) {
        let y = row;
        let x = col;
        let attackedPiece = '';

        while (true) {
            y += directions[i][1];
            x += directions[i][0];

            if (x < 0 || x > 7 || y < 0 || y > 7 || (x === col && y === row) || (positions[y][x][0] === positions[row][col][0] && !isCheckingSquares)) {
                break;
            } else if (attackedPiece && isCheckingSquares && positions[y][x]) {
                if (positions[y][x][1] === 'k' && positions[y][x][0] !== positions[row][col][0]) {
                    viableMoves.push(`${attackedPiece} pin`);
                }
                break;
            } else if (positions[y][x]) {
                viableMoves.push(`${y}${x} mark`);

                if (positions[y][x][1] !== 'k') attackedPiece = `${y}${x}`;

                if (!isCheckingSquares) break;
            } else if (!attackedPiece) {
                viableMoves.push(`${y}${x} valid-move`);
            }
        }
    }

    viableMoves = checkPinnedSquares(pinnedSquares, viableMoves, row, col);

    return checkKingCheckSquares(kingCheckSquares, viableMoves);
}

function calcKnightMoves(directions, positions, row, col, kingCheckSquares, pinnedSquares, isCheckingSquares) {
    let viableMoves = [];

    for (const direction of directions) {
        const rowY = row + direction[0];
        const colX = col + direction[1];

        if ((rowY < 0 || colX < 0 || rowY > 7 || colX > 7) || (positions[rowY][colX][0] === positions[row][col][0] && !isCheckingSquares)) {
            continue;
        } else if (positions[rowY][colX][0]) {
            viableMoves.push(`${rowY}${colX} mark`);
        } else {
            viableMoves.push(`${rowY}${colX} valid-move`);
        }
    }

    viableMoves = checkPinnedSquares(pinnedSquares, viableMoves, row, col);

    return checkKingCheckSquares(kingCheckSquares, viableMoves);
}

function calcKingMoves(directions, positions, row, col, attackedSquares, castling, player, isCheckingSquares) {
    const piece = positions[row][col];
    const isPlayerWhite = player.color === 'w';
    const side = piece[0] === 'w' ? (isPlayerWhite ? 7 : 0) : (!isPlayerWhite ? 7 : 0);
    let viableMoves = [];

    for (const direction of directions) {
        const rowY = row + direction[0];
        const colX = col + direction[1];

        if ((rowY < 0 || colX < 0 || rowY > 7 || colX > 7) ||
            (positions[rowY][colX][0] === positions[row][col][0] && !isCheckingSquares) ||
            (!isCheckingSquares && attackedSquares.current[positions[row][col][0]].includes(`${rowY}${colX}`))
        ) {
            continue;
        } else if (positions[rowY][colX][0]) {
            viableMoves.push(`${rowY}${colX} mark`);
        } else {
            viableMoves.push(`${rowY}${colX} valid-move`);
        }
    }

    if (!isCheckingSquares) {
        const kingSideCastling = isPlayerWhite ? [`${row}${col + 1}`, `${row}${col + 2}`] : [`${row}${col - 1}`, `${row}${col - 2}`];
        const queenSideCastling = isPlayerWhite ? [`${row}${col - 1}`, `${row}${col - 2}`, `${row}${col - 3}`] : [`${row}${col + 1}`, `${row}${col + 2}`, `${row}${col + 3}`];

        if (castling.includes(isPlayerWhite ? 'K' : 'k') && checkCastling(positions, kingSideCastling, attackedSquares, piece[0])) {
            viableMoves.push(`${side}${isPlayerWhite ? 6 : 1} valid-move`);
        }
        if (castling.includes(isPlayerWhite ? 'Q' : 'q') && checkCastling(positions, queenSideCastling, attackedSquares, piece[0])) {
            viableMoves.push(`${side}${isPlayerWhite ? 2 : 5} valid-move`);
        }
    }

    return viableMoves;
}

function calcPawnMoves(positions, type, row, col, kingCheckSquares, pinnedSquares, player, isCheckingSquares) {
    const isPlayerWhite = player.color === 'w';
    const direction = type === 'w' ? (isPlayerWhite ? -1 : 1) : (!isPlayerWhite ? -1 : 1);
    const startingPos = type === 'w' ? (isPlayerWhite ? 6 : 1) : (!isPlayerWhite ? 6 : 1);
    const topLeftSquare = positions[row + direction][col - 1];
    const topRightSquare = positions[row + direction][col + 1];
    let viableMoves = [];

    if (!isCheckingSquares) {
        if (!positions[row + direction][col]) {
            viableMoves.push(`${row + direction}${col} valid-move`);
            if (row === startingPos && !positions[startingPos + direction * 2][col]) {
                viableMoves.push(`${row + direction * 2}${col} valid-move`);
            }
        }

        if (col - 1 >= 0 && topLeftSquare && topLeftSquare[0] !== type) viableMoves.push(`${row + direction}${col - 1} mark`);
        if (col + 1 <= 7 && topRightSquare && topRightSquare[0] !== type) viableMoves.push(`${row + direction}${col + 1} mark`);
    } else {
        if (col - 1 >= 0) viableMoves.push(`${row + direction}${col - 1} mark`);
        if (col + 1 <= 7) viableMoves.push(`${row + direction}${col + 1} mark`);
    }

    viableMoves = checkPinnedSquares(pinnedSquares, viableMoves, row, col);

    return checkKingCheckSquares(kingCheckSquares, viableMoves);
}

function getAvailableMoves(game, piece, row, col, squares, player, isCheckingSquares) {
    const { positions, turn, castling } = game;
    const { attackedSquares, kingCheckSquares, pinnedSquares } = squares;
    const playersKingCheckSquares = kingCheckSquares.current[piece[0]];
    const playersPinnedSquares = pinnedSquares.current[piece[0]];

    if (player.color !== turn) return [];
    if (!isCheckingSquares && turn !== piece[0]) return [];

    switch (piece[1]) {
        case 'p':
            return calcPawnMoves(positions, piece[0], row, col, playersKingCheckSquares, playersPinnedSquares, player, isCheckingSquares);
        case 'n':
            return calcKnightMoves(knightDirections(), positions, row, col, playersKingCheckSquares, playersPinnedSquares, isCheckingSquares);
        case 'k':
            return calcKingMoves(kingDirections(), positions, row, col, attackedSquares, castling, player, isCheckingSquares);
        case 'r':
            return calcQueenRookBishopMoves(rookDirections(), positions, row, col, playersKingCheckSquares, playersPinnedSquares, isCheckingSquares);
        case 'b':
            return calcQueenRookBishopMoves(bishopDirections(), positions, row, col, playersKingCheckSquares, playersPinnedSquares, isCheckingSquares);
        case 'q':
            return calcQueenRookBishopMoves(queenDirections(), positions, row, col, playersKingCheckSquares, playersPinnedSquares, isCheckingSquares);
        default:
            throw new Error();
    }
}

export { getAvailableMoves };
