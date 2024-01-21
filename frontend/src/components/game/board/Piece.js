import { useState } from 'react';
import calcPosition from '../../../helpers/CalculatePosition';

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

        event.target.style.left = `${event.clientX-pos[0]-45}px`;
        event.target.style.top = `${event.clientY-pos[1]-45}px`;
    }

    function handleDragEnd(event) {
        event.target.removeAttribute('style');
        setHighlightedSquare({
            show: false,
            row: 0,
            col: 0
        });
    }

    return (
        <div
            draggable={true}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`piece ${type} p-${row}${col}`}
        >
        </div>
    );
}
