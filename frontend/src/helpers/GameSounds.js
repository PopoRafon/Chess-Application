export default function playSound(move) {
    let audio;

    if (move.includes('O-O')) {
        audio = new Audio('/static/sounds/castle.mp3');
    } else if (move.includes('=')) {
        audio = new Audio('/static/sounds/promote.mp3');
    } else if (move.includes('+')) {
        audio = new Audio('/static/sounds/check.mp3');
    } else if (move.includes('x')) {
        audio = new Audio('/static/sounds/capture.mp3');
    } else {
        audio = new Audio('/static/sounds/move.mp3');
    }

    audio.play().catch(error => console.log(error));
}
