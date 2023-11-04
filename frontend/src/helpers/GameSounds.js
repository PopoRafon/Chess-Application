export default function playSound(pieceCaptured, type) {
    if (type === 'castle') {
        new Audio('/static/sounds/castle.mp3').play();
    } else if (pieceCaptured) {
        new Audio('/static/sounds/capture.mp3').play();
    } else {
        new Audio('/static/sounds/move.mp3').play();
    }
}
