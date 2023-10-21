export default function checkThreefoldRepetition(prevMoves, dispatchGame) {
    const prevTenMoves = prevMoves.slice(-10);

    if (prevTenMoves[0][0] === prevTenMoves[4][0] &&
        prevTenMoves[4][0] === prevTenMoves[8][0] &&
        prevTenMoves[1][0] === prevTenMoves[5][0] &&
        prevTenMoves[5][0] === prevTenMoves[9][0]
    ) {
        dispatchGame({
            type: 'GAME_END',
            result: 'Threefold repetition! Draw!'
        });
    }
}
