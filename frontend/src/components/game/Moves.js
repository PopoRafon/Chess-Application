import { queenDirections, rookDirections, bishopDirections, knightDirections, kingDirections } from '../../helpers/Directions';
import checkPinnedSquares from '../../helpers/PinnedSquares';
import checkKingCheckSquares from '../../helpers/KingCheckSquares';
import checkCastling from '../../helpers/Castling';

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

                if (positions[y][x][1] !== 'k') {
                    attackedPiece = `${y}${x}`;
                }

                if (!isCheckingSquares) {
                    break;
                }
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

function calcKingMoves(directions, positions, attackedSquares, row, col, castlingDirections, isCheckingSquares) {
    const piece = positions[row][col];
    const side = piece[0] === 'w' ? '7' : '0';
    let viableMoves = [];

    for (const direction of directions) {
        const rowY = row + direction[0];
        const colX = col + direction[1];

        if ((rowY < 0 || colX < 0 || rowY > 7 || colX > 7) || (positions[rowY][colX][0] === positions[row][col][0] && !isCheckingSquares)) {
            continue;
        } else if (!isCheckingSquares && attackedSquares.current[positions[row][col][0]].includes(`${rowY}${colX}`)) {
            continue;
        } else if (positions[rowY][colX][0]) {
            viableMoves.push(`${rowY}${colX} mark`);
        } else {
            viableMoves.push(`${rowY}${colX} valid-move`);
        }
    }

    if (!isCheckingSquares) {
        const leftCastlingPositions = [`${row}${col - 1}`, `${row}${col - 2}`, `${row}${col - 3}`];
        const rightCastlingPositions = [`${row}${col + 1}`, `${row}${col + 2}`];

        if ((castlingDirections[piece] === 'left' || castlingDirections[piece] === 'both') && checkCastling(positions, leftCastlingPositions, attackedSquares, piece[0])) {
            viableMoves.push(`${side}2 valid-move`);
        }
        if ((castlingDirections[piece] === 'right' || castlingDirections[piece] === 'both') && checkCastling(positions, rightCastlingPositions, attackedSquares, piece[0])) {
            viableMoves.push(`${side}6 valid-move`);
        }
    }

    return viableMoves;
}

function calcPawnMoves(positions, type, row, col, kingCheckSquares, pinnedSquares, isCheckingSquares) {
    let viableMoves = [];
    const direction = type[0] === 'w' ? -1 : 1;
    const startingPos = type[0] === 'w' ? 6 : 1;
    const topLeftSquare = positions[row + direction][col - 1];
    const topRightSquare = positions[row + direction][col + 1];

    if (!isCheckingSquares) {
        if (!positions[row + direction][col]) {
            viableMoves.push(`${row + direction}${col} valid-move`);
            if (row === startingPos && !positions[startingPos + direction * 2][col]) {
                viableMoves.push(`${row + direction * 2}${col} valid-move`);
            }
        }

        if (col - 1 >= 0 && topLeftSquare && topLeftSquare[0] !== type[0]) viableMoves.push(`${row + direction}${col - 1} mark`);
        if (col + 1 <= 7 && topRightSquare && topRightSquare[0] !== type[0]) viableMoves.push(`${row + direction}${col + 1} mark`);
    } else {
        if (col - 1 >= 0) viableMoves.push(`${row + direction}${col - 1} mark`);
        if (col + 1 <= 7) viableMoves.push(`${row + direction}${col + 1} mark`);
    }

    viableMoves = checkPinnedSquares(pinnedSquares, viableMoves, row, col);

    return checkKingCheckSquares(kingCheckSquares, viableMoves);
}

function getViableMoves(game, piece, attackedSquares, row, col, kingCheckSquares, pinnedSquares, isCheckingSquares) {
    const { positions, turn, castlingDirections } = game;
    const playersKingCheckSquares = kingCheckSquares.current[piece[0]];
    const playersPinnedSquares = pinnedSquares.current[piece[0]];

    if (!isCheckingSquares && turn !== piece[0]) return [];

    switch (piece[1]) {
        case 'p':
            return calcPawnMoves(positions, piece, row, col, playersKingCheckSquares, playersPinnedSquares, isCheckingSquares);
        case 'n':
            return calcKnightMoves(knightDirections(), positions, row, col, playersKingCheckSquares, playersPinnedSquares, isCheckingSquares);
        case 'k':
            return calcKingMoves(kingDirections(), positions, attackedSquares, row, col, castlingDirections, isCheckingSquares);
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

function validateMove(game, piece, attackedSquares, oldRow, oldCol, row, col, kingCheckSquares, pinnedSquares) {
    const viableMoves = getViableMoves(game, piece, attackedSquares, Number(oldRow), Number(oldCol), kingCheckSquares, pinnedSquares);

    for (const move of viableMoves) {
        if (move.includes(`${row}${col}`)) {
            return true;
        }
    }

    return false;
}

export { validateMove, getViableMoves };
