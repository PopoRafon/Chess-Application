export default function playSound(pieceCaptured) {
    if (pieceCaptured) {
        new Audio('/static/sounds/capture.mp3').play();
    } else {
        new Audio('/static/sounds/move.mp3').play();
    }
}
