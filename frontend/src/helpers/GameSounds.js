export default function playSound(move) {
    if (move.includes('O-O')) {
        new Audio('/static/sounds/castle.mp3').play();
    } else if (move.includes('=')) {
        new Audio('/static/sounds/promote.mp3').play();
    } else if (move.includes('+')) {
        new Audio('/static/sounds/check.mp3').play();
    } else if (move.includes('x')) {
        new Audio('/static/sounds/capture.mp3').play();
    } else {
        new Audio('/static/sounds/move.mp3').play();
    }
}
