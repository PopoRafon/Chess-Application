export default function checkGameResult(positions, player) {
    const oppositePlayer = player === 'w' ? 'b' : 'w';

    for (const row of positions) {
        for (const piece of row) {
            if (piece[0] === oppositePlayer && (piece[1] === 'p' || piece[1] === 'r' || piece[1] === 'q')) {
                return oppositePlayer;
            }
        }
    }

    return 'draw';
}
