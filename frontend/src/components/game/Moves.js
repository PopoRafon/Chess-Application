function validate_pawn(piece, prevRow, prevCol, newRow, newCol, positions) {
    const rowDiff = newRow - prevRow;
    const colDiff = newCol - prevCol;
    const pieceOnNewPosition = positions[newRow][newCol];

    if (piece[0] === 'w') {
        if (rowDiff === -1 && colDiff === 0 && !pieceOnNewPosition) {
            return true;
        } else if (rowDiff === -1 && (colDiff === 1 || colDiff === -1) && pieceOnNewPosition) {
            return true;
        } else if (prevRow === 6 && rowDiff === -2 && colDiff === 0) {
            return true;
        }
    } else {
        if (rowDiff === 1 && colDiff === 0 && !pieceOnNewPosition) {
            return true;
        } else if (rowDiff === 1 && (colDiff === 1 || colDiff === -1) && pieceOnNewPosition) {
            return true;
        } else if (prevRow === 1 && rowDiff === 2 && colDiff === 0) {
            return true;
        }
    }

    return false;
}

function validate_rook(prevRow, prevCol, newRow, newCol, positions) {
    const rowDiff = newRow - prevRow;
    const colDiff = newCol - prevCol;

    if (rowDiff === 0) {
        if (colDiff < 0) { // Checking left
            for (let i = colDiff + 1; i < 0; i++) {
                if (positions[prevRow][prevCol + i] !== '') {
                    return false;
                }
            }
            return true;
        } else if (colDiff > 0) { // Checking right
            for (let i = colDiff - 1; i > 0; i--) {
                if (positions[prevRow][prevCol + i] !== '') {
                    return false;
                }
            }
        }
        return true;
    } else if (colDiff === 0) {
        if (rowDiff < 0) { // Checking top
            for (let i = rowDiff + 1; i < 0; i++) {
                if (positions[prevRow + i][prevCol] !== '') {
                    return false;
                }
            }
            return true;
        } else if (rowDiff > 0) { // Checking bottom
            for (let i = rowDiff - 1; i > 0; i--) {
                if (positions[prevRow + i][prevCol] !== '') {
                    return false;
                }
            }
        }
        return true;
    }

    return false;
}

function validate_bishop(prevRow, prevCol, newRow, newCol, positions) {
    const rowDiff = newRow - prevRow;
    const colDiff = newCol - prevCol;

    if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        if (rowDiff < 0 && colDiff < 0) { // Checking top left
            for (let i = rowDiff + 1; i < 0; i++) {
                if (positions[prevRow + i][prevCol + i] !== '') {
                    return false;
                }
            }
        } else if (rowDiff < 0 && colDiff > 0) { // Checking top right
            for (let i = rowDiff + 1; i < 0; i++) {
                if (positions[prevRow + i][prevCol - i] !== '') {
                    return false;
                }
            }
        } else if (rowDiff > 0 && colDiff > 0) { // Checking bottom right
            for (let i = rowDiff - 1; i > 0; i--) {
                if (positions[prevRow + i][prevCol + i] !== '') {
                    return false;
                }
            }
        } else if (rowDiff > 0 && colDiff < 0) { // Checking bottom left
            for (let i = rowDiff - 1; i > 0; i--) {
                if (positions[prevRow + i][prevCol - i] !== '') {
                    return false;
                }
            }
        }

        return true;
    }

    return false;
}

function validate_king(prevRow, prevCol, newRow, newCol) {
    const rowDiff = newRow - prevRow;
    const colDiff = newCol - prevCol;

    if ((rowDiff >= -1 && rowDiff <= 1) && (colDiff >= -1 && colDiff <= 1)) {
        return true;
    }

    return false;
}

function validate_knight(prevRow, prevCol, newRow, newCol) {
    const rowDiff = newRow - prevRow;
    const colDiff = newCol - prevCol;

    if (rowDiff === 2 && (colDiff === 1 || colDiff === -1)) {
        return true;
    } else if (rowDiff === 1 && (colDiff === 2 || colDiff === -2)) {
        return true;
    } else if (rowDiff === -1 && (colDiff === 2 || colDiff === -2)) {
        return true;
    } else if (rowDiff === -2 && (colDiff === 1 || colDiff === -1)) {
        return true;
    }

    return false;
}

function validate_queen(prevRow, prevCol, newRow, newCol, positions) {
    if (validate_rook(prevRow, prevCol, newRow, newCol, positions)) {
        return true;
    } else if (validate_bishop(prevRow, prevCol, newRow, newCol, positions)) {
        return true;
    }
    
    return false;
}

export default function validate_move(data, newRow, newCol, turn, positions) {
    const piece = data[0];
    const prevRow = Number(data[1]);
    const prevCol = Number(data[2]);

    if (turn !== piece[0]) return false;
    
    if (prevRow === newRow && prevCol === newCol) return false;

    if (positions[newRow][newCol][0] === piece[0]) return false;

    if (piece[1] === 'p' && validate_pawn(piece, prevRow, prevCol, newRow, newCol, positions)) return true;

    if (piece[1] === 'r' && validate_rook(prevRow, prevCol, newRow, newCol, positions)) return true;

    if (piece[1] === 'b' && validate_bishop(prevRow, prevCol, newRow, newCol, positions)) return true;

    if (piece[1] === 'k' && validate_king(prevRow, prevCol, newRow, newCol)) return true;

    if (piece[1] === 'n' && validate_knight(prevRow, prevCol, newRow, newCol)) return true;

    if (piece[1] === 'q' && validate_queen(prevRow, prevCol, newRow, newCol, positions)) return true;

    return false;
}
