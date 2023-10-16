export default function playSound(move, capturedPiece) {
    if (move === 'O-O' || move === 'O-O-O') {
        new Audio('/static/sounds/castle.mp3').play();
    } else if (capturedPiece) {
        new Audio('/static/sounds/capture.mp3').play();
    } else {
        new Audio('/static/sounds/move.mp3').play();
    }
}
