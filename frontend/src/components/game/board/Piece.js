import { useState } from 'react';
import calcPosition from '#helpers/CalculatePosition';

export default function Piece({ type, row, col, piecesRef, setHighlightedSquare }) {
    const [pos, setPos] = useState();

    function handleDragStart(event) {
        const { left, top } = event.target.getBoundingClientRect();

        event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', [type, row, col]);
        event.target.style.zIndex = '20';

        setPos([left, top]);
    }

    function handleDrag(event) {
        const highlightedSquareNewPos = calcPosition(piecesRef, event)

        if (highlightedSquareNewPos[0] < 0 || highlightedSquareNewPos[0] > 7 || highlightedSquareNewPos[1] < 0 || highlightedSquareNewPos[1] > 7) {
            setHighlightedSquare(prev => ({
                ...prev,
                show: false
            }));
        } else {
            setHighlightedSquare({
                show: true,
                row: highlightedSquareNewPos[0],
                col: highlightedSquareNewPos[1]
            });
        }

        event.target.style.left = `${event.clientX - pos[0] - 45}px`;
        event.target.style.top = `${event.clientY - pos[1] - 45}px`;
    }

    function handleDragEnd(event) {
        event.target.removeAttribute('style');
        setHighlightedSquare({
            show: false,
            row: 0,
            col: 0
        });
    }

    function handleTouchStart(event) {
        const { left, top } = event.target.getBoundingClientRect();

        event.target.style.zIndex = '20';

        setPos([left, top]);
    }

    function handleTouchMove(event) {
        const { clientX, clientY } = event.touches[0];

        event.target.style.left = `${(clientX - pos[0]) * 2 - 45}px`;
        event.target.style.top = `${(clientY - pos[1]) * 2 - 45}px`;
    }

    function handleTouchEnd(event) {
        const { left, top, width, height } = event.target.getBoundingClientRect();

        event.target.removeAttribute('style');
        const dropEvent = new Event('drop', { bubbles: true });
        dropEvent.dataTransfer = { getData: () => `${type},${row},${col}` };
        dropEvent.clientX = left + (width / 2);
        dropEvent.clientY = top + (height / 2);

        event.target.dispatchEvent(dropEvent);
    }

    return (
        <div
            draggable={true}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`piece ${type} p-${row}${col}`}
        >
        </div>
    );
}
