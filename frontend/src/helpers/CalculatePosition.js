export default function calcPosition(piecesRef, event) {
    const { width, x, y } = piecesRef.current.getBoundingClientRect();
    const squareSize = width / 8;
    const row = Math.floor((event.clientY - y) / squareSize);
    const col = Math.floor((event.clientX - x) / squareSize);

    return [row, col];
}
